import { Injectable } from '@angular/core';
import { FuseNavigationItem, FuseNavigationService } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { contacts } from 'app/mock-api/apps/contacts/data';
import { tasks } from 'app/mock-api/apps/tasks/data';
//import { defaultNavigation } from 'app/mock-api/common/navigation/data';
import { cloneDeep } from 'lodash-es';

@Injectable({providedIn: 'root'})
export class SearchMockApi
{
    _defaultNavigation: any = localStorage.getItem("menus");
    private readonly _contacts: any[] = contacts;
    private readonly _tasks: any[] = tasks;

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _fuseNavigationService: FuseNavigationService,
    )
    {
        this._defaultNavigation = this._defaultNavigation == null?[]:JSON.parse(this._defaultNavigation);
       const menu =  this.transformMenuJson( this._defaultNavigation )
        // Register Mock API handlers
        this.registerHandlers(menu);
    }
    transformMenuJson(menuJson: any): any {
        // Imprimir para ver qué se recibe en el argumento
        console.log("Received menuJson:", menuJson);
        console.log("Type of menuJson:", typeof menuJson);
        
        // Si el valor recibido es un string, intentar parsearlo
        if (typeof menuJson === 'string') {
          try {
            menuJson = JSON.parse(menuJson);  // Parseamos el JSON si es un string
          } catch (e) {
            console.error('Error parsing JSON:', e);
            return [];  // Si ocurre un error, devolvemos un array vacío
          }
        }
      
        // Ahora verificamos si es un array
        if (Array.isArray(menuJson)) {
          return menuJson.map(item => {
            // Transformar idPerfil a un array de números
            item.idPerfil = item.idPerfil.map(profile => profile.idPerfil);
      
            // Transformar idPerfil en submenús
            if (item.children && item.children.length > 0) {
              item.children = item.children.map(child => {
                child.idPerfil = child.idPerfil.map(profile => profile.idPerfil);
                return child;
              });
            }
      
            return item;
          });
        } else {
          console.error('menuJson is not an array:', menuJson);
          return [];  // Si no es un array, devolvemos un array vacío
        }
      }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(menu): void
    {
        // Get the flat navigation and store it
        const flatNavigation = this._fuseNavigationService.getFlatNavigation(menu);

        // -----------------------------------------------------------------------------------------------------
        // @ Search results - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/common/search')
            .reply(({request}) =>
            {
                // Get the search query
                const query = cloneDeep(request.body.query.toLowerCase());

                // If the search query is an empty string,
                // return an empty array
                if ( query === '' )
                {
                    return [200, {results: []}];
                }

                // Filter the contacts
                const contactsResults = cloneDeep(this._contacts)
                    .filter(contact => contact.name.toLowerCase().includes(query));

                // Filter the navigation
                const pagesResults = cloneDeep(flatNavigation)
                    .filter(page => (page.title?.toLowerCase().includes(query) || (page.subtitle && page.subtitle.includes(query))));

                // Filter the tasks
                const tasksResults = cloneDeep(this._tasks)
                    .filter(task => task.title.toLowerCase().includes(query));

                // Prepare the results array
                const results = [];

                // If there are contacts results...
                if ( contactsResults.length > 0 )
                {
                    // Normalize the results
                    contactsResults.forEach((result) =>
                    {
                        // Add a link
                        result.link = '/apps/contacts/' + result.id;

                        // Add the name as the value
                        result.value = result.name;
                    });

                    // Add to the results
                    results.push({
                        id     : 'contacts',
                        label  : 'Contacts',
                        results: contactsResults,
                    });
                }

                // If there are page results...
                if ( pagesResults.length > 0 )
                {
                    // Normalize the results
                    pagesResults.forEach((result: any) =>
                    {
                        // Add the page title as the value
                        result.value = result.title;
                    });

                    // Add to the results
                    results.push({
                        id     : 'pages',
                        label  : 'Pages',
                        results: pagesResults,
                    });
                }

                // If there are tasks results...
                if ( tasksResults.length > 0 )
                {
                    // Normalize the results
                    tasksResults.forEach((result) =>
                    {
                        // Add a link
                        result.link = '/apps/tasks/' + result.id;

                        // Add the title as the value
                        result.value = result.title;
                    });

                    // Add to the results
                    results.push({
                        id     : 'tasks',
                        label  : 'Tasks',
                        results: tasksResults,
                    });
                }

                // Return the response
                return [200, results];
            });
    }

}

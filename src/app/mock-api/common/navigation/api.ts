import { Injectable } from '@angular/core'
import { FuseNavigationItem } from '@fuse/components/navigation'
import { FuseMockApiService } from '@fuse/lib/mock-api'
//import { defaultNavigation } from 'app/mock-api/common/navigation/data'
import { cloneDeep } from 'lodash-es'

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
  // private readonly _compactNavigation: FuseNavigationItem[] =
  //     compactNavigation;
 _defaultNavigation: any = localStorage.getItem("menus");
 menu:any;
  // private readonly _futuristicNavigation: FuseNavigationItem[] =
  //     futuristicNavigation;
  // private readonly _horizontalNavigation: FuseNavigationItem[] =
  //     horizontalNavigation;

  /**
   * Constructor
   */
  constructor(private _fuseMockApiService: FuseMockApiService) {
    // Register Mock API handlers
    this._defaultNavigation = this._defaultNavigation == null?[]:JSON.parse(this._defaultNavigation);
    this.menu = this.transformMenuJson( this._defaultNavigation )
    this.registerHandlers()
  }


  transformMenuJson(menuJson: any): any {
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
      }
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ Navigation - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onGet('api/common/navigation').reply(() => {
      // // Fill compact navigation children using the default navigation
      // this._compactNavigation.forEach((compactNavItem) => {
      //     this._defaultNavigation.forEach((defaultNavItem) => {
      //         if (defaultNavItem.id === compactNavItem.id) {
      //             compactNavItem.children = cloneDeep(
      //                 defaultNavItem.children
      //             );
      //         }
      //     });
      // });

      // // Fill futuristic navigation children using the default navigation
      // this._futuristicNavigation.forEach((futuristicNavItem) => {
      //     this._defaultNavigation.forEach((defaultNavItem) => {
      //         if (defaultNavItem.id === futuristicNavItem.id) {
      //             futuristicNavItem.children = cloneDeep(
      //                 defaultNavItem.children
      //             );
      //         }
      //     });
      // });

      // // Fill horizontal navigation children using the default navigation
      // this._horizontalNavigation.forEach((horizontalNavItem) => {
      //     this._defaultNavigation.forEach((defaultNavItem) => {
      //         if (defaultNavItem.id === horizontalNavItem.id) {
      //             horizontalNavItem.children = cloneDeep(
      //                 defaultNavItem.children
      //             );
      //         }
      //     });
      // });

      // Return the response
      return [
        200,
        {
          // compact: cloneDeep(this._compactNavigation),
          default: cloneDeep(this.menu),
          // futuristic: cloneDeep(this._futuristicNavigation),
          // horizontal: cloneDeep(this._horizontalNavigation),
        },
      ]
    })
  }

  
}

import { CommonModule } from '@angular/common'
import { Component, inject, ViewChild } from '@angular/core'
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialog } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { ProvidersRequestsService } from '@fuse/services/providers'
import { catchError, of, tap } from 'rxjs'
import { NewUserComponent } from '../users/modals/new-user/new-user.component'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'
import { RolService } from './services/rol.service'
import { ToastrService } from 'ngx-toastr'
import { FuseAlertType } from '@fuse/components/alert'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { FuseConfirmationService } from '@fuse/services/confirmation'

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  // styles: [':host{display:contents}'], // Makes component host as if it was not there, can offer less css headaches. Use @HostBinding class approach for easier overrides.
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule,
    TranslocoModule,
    MatCheckboxModule
    
  ],
})
export class RolesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator
  toastr = inject(ToastrService);
  confirm = inject(FuseConfirmationService)
  transloco = inject(TranslocoService)
  matDialog = inject(MatDialog)
  requests = inject(ProvidersRequestsService)
  resqRol = inject(RolService)
  displayedColumns: string[] = ["Item","IdPermiso",'IdMenu', 'Menu','IdSubMenu', 'SubMenu',"Activo","idPerfil"]
  // dataSource: WritableSignal<any[]> = signal([]);;
    alert: { type: FuseAlertType; message: string } = {
      type: 'success',
      message: '',
    }
  fb = inject(FormBuilder)
  fg = this.fb.group({
    rol: [null, [Validators.required]]
  })
  filtering = false
  dataSource = new MatTableDataSource<any>([]);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  ngOnInit(): void {
    this.rol();
   // this.getData().subscribe()
  }

  listRol= []
  rol() {
    this.resqRol.roles().subscribe((data) => {
      this.listRol = data
    })
  }

  doFilter() {
    this.filtering = true
    this.getData().subscribe()
  }

 

  clearFilter() {
    this.fg.reset({
      rol: null,
    })
  }
  clearFilters() {
    this.clearFilter();
    this.dataSource.data = [];
    if (this.fg.valid) {
      this.getData().subscribe(() => {
        this.filtering = false;
      })
    }
    this.filtering = false;
  }

  getData() {
     if (this.fg.valid) {
          return this.resqRol.listRolId(this.fg.get('rol').value).pipe(
            tap((response: any) => {
              if (response.statusCode  === 200) {
                if (response.data.length > 0) {
                  const _data = response.data.map((e) => ({
                    id:e.idPermiso,
                    IdMenu: e.IdMenu,
                    Menu: e.Menu,
                    IdSubMenu: e.IdSubMenu,
                    SubMenu: e.SubMenuSpanish,
                    Activo: e.Activo?true:false,
                    idPerfil:e.idPerfil
                  }))
                  this.dataSource.data = _data;
                } else {
                  this.toastr.success(response.code, 'No hay data');
                  this.dataSource.data = [];
                }
              } else {
                this.toastr.error(response.code, response.message);
                this.dataSource.data = [];
              }
            }),
            catchError((error) => {
              this.alert = {
                type: 'error',
                message: 'Ocurrió un error al cargar las órdenes. ' + error,
              }
              return of([])
            })
          )
      }

  }

  openNew() {
    const _$ = this.matDialog.open(NewUserComponent, {
      width: '400px',
    })

    _$.afterClosed().subscribe(() => {
      this.getData().subscribe()
    })
  }
  // Método que maneja el cambio en el checkbox
  onCheckboxChange(event: any, element: any) {
      this.openUpdateDialog(element,event.checked);
    
  }

  // Método que abre el modal de actualización
  openUpdateDialog(element: any, checkbox): void {
    let req = {
      id:element.id,
      idPerfil:element.idPerfil,
      idSubMenu:element.IdSubMenu,
      activo:checkbox == true?1:0
    }
     
    const dialogRef = this.confirm.open({
      title: this.transloco.translate('eliminacion.confirm'), // Traducción del título
      actions: {
        confirm: {
          label: this.transloco.translate('eliminacion.confirmar'), // Traducción del botón Confirmar
        },
        cancel: {
          label: this.transloco.translate('eliminacion.cancelar'), // Traducción del botón Cancelar
        },
      },
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.resqRol.updatePermiso(req).subscribe((result)=>{
         if(result.statusCode == 200){
          this.getData().subscribe()
         }
        })
      }else{
        this.getData().subscribe()
      }
   
    })
  }

  // Función para actualizar el elemento
  updateElement(element: any) {
    // Aquí va la lógica para actualizar el elemento, por ejemplo, enviarlo a un servicio
    console.log('Actualizando el elemento:', element);
  }

}

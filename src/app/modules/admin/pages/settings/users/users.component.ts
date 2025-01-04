import { CommonModule } from '@angular/common'
import { Component, inject, ViewChild } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { ProvidersRequestsService } from '@fuse/services/providers'
import { tap } from 'rxjs'
import { NewProviderComponent } from '../../providers/evaluate/modals/new-provider/new-provider.component'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { RouterModule } from '@angular/router'
import { NewUserComponent } from './modals/new-user/new-user.component'
import { UserService } from './services/user.service'
import { TranslocoModule } from '@ngneat/transloco'
import { RolService } from '../roles/services/rol.service'
import { CombosService } from 'app/modules/admin/pages/providers/services/combos.service'
import { OnlyNumbersDirective } from 'assets/only-number'
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
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
     TranslocoModule,
    RouterModule,
    OnlyNumbersDirective
  ],
})
export class UsersComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator

  matDialog = inject(MatDialog)
  requests = inject(ProvidersRequestsService)
  userService = inject(UserService)
  combosRequest = inject(CombosService)
 resqRol = inject(RolService)
 data:any;
 edit=false;
  displayedColumns: string[] = ['code','idUser','idPersona','idProveedor','idPerfil','Rol','usuario','password','nombre','apellido','email', 'area', 'status', 'actions']
  // dataSource: WritableSignal<any[]> = signal([]);;
  fb = inject(FormBuilder)
  fg = this.fb.group({
    ruc: [null, [Validators.pattern(/^\d{11}$/)]],
    idPerfil: [null],
    usuario: [''],
    idProveedor: [null],
  })
  filtering = false
  dataSource = new MatTableDataSource<any>([])

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('userData'));
    if(this.data.idPerfil !='2' && this.data.idPerfil !='3'){
      this.edit=true;
    }else{
      this.edit=false;
    }
    this.rol();
    this.rolModal();
    this.getData().subscribe()
    this.getlistCategoria();
    this.getlistTipoProv();
    this.getProveedores();
  }

  listRol= []
  rol() {
    this.resqRol.roles().subscribe((data) => {
      this.listRol = data
    })
  }
  listRolModal= []
  rolModal() {
    this.resqRol.roles().subscribe((data) => {
      this.listRolModal = data
    })
  }

  doFilter() {
    this.filtering = true
    this.getData().subscribe()
  }

  clearFilters() {
    this.fg.reset()
    this.getData().subscribe(() => {
      this.filtering = false
    })
  }

  getData() {
    const formData = this.fg.getRawValue();
    //formData.idProveedor = Number(this.data.idProveedor);
    return this.userService.listUsers(formData).pipe(
      tap((response: any) => {
        if (response.statusCode  === 200) {
          if (response.data.length > 0) {
            const _data = response.data.map((e) => ({
              idUser: e.id,
              idPerfil:e.idPerfil,
              idProveedor:e.idProveedor,
              idPersona:e.idPersona,
              nombrePerfil:e.nombrePerfil,
              ruc: e.ruc == null ?'-':e.ruc,
              razonSocial: e.razonSocial,
              nombre: e.nombres ,
              apellido:e.apellidos,
              usuario:e.usuario,
              password:e.clave,
              correo:e.correo,
              area:e.area,
              status: e.estado == true ? 'Activo' : 'Inactivo',
              actions: true,
            }))
            this.dataSource.data = _data
          }
        }else{
          this.dataSource.data = []
        }
      
      })
    )
  }
  category = []
  getlistCategoria(){
    this.combosRequest.getListadoCatProv().subscribe((response) => {
      this.category = response.data
    })
  }
  tipoProv = []
  getlistTipoProv(){
    this.combosRequest.getListadoTipoProv().subscribe((response) => {
      this.tipoProv = response.data
    })
  }
  openNew(data) {
  let resul = data == undefined ? null : data;
 const dialog = this.matDialog.open(NewUserComponent, {
      data: {
        category:this.category,
        tipoProv:this.tipoProv,
        rol:this.listRolModal,
        proveedor:this.listProveedor,
        title: resul == undefined? 'Nuevo Usuario': 'Editar Usuario',
        boton: resul == undefined? 'Crear': 'Editar',
        data: resul
      },
      width: '700px' 
    })
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.getData().subscribe()
      }
    })

  }
  listProveedor:any=[];
  getProveedores(){
    this.requests.listProviders(this.fg.getRawValue()).subscribe((response) => {
      this.listProveedor = response;
    })

  }
}

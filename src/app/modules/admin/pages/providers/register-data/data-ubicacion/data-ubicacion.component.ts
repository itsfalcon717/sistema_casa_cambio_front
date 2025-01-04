import { DialogModule } from '@angular/cdk/dialog'
import { CommonModule } from '@angular/common'
import { Component, inject, ViewChild } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatIcon } from '@angular/material/icon'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'
import { NewUbicacionComponent } from '../modals/new-ubicacion/new-ubicacion.component'
import { UserService } from 'app/core/user/user.service'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { ActivatedRoute } from '@angular/router'
import { ContactoService } from '@fuse/services/providers/contacto.service'
import { MatDialog } from '@angular/material/dialog'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { UbicacionService } from '@fuse/services/providers/ubicacion.service'

@Component({
  selector: 'app-data-ubicacion',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckbox,
    MatButton,
    MatIcon,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    DialogModule,
    MatPaginator,
    TranslocoModule,
  ],
  templateUrl: './data-ubicacion.component.html',
})
export class DataUbicacionComponent {
  displayedColumns: string[] = ['names', 'phone', 'email', 'document', 'principal', 'tipo', 'actions']
  matDialog = inject(MatDialog)
  ubicacionSvc = inject(UbicacionService)
  router = inject(ActivatedRoute)
  @ViewChild(MatPaginator) paginator: MatPaginator
  dataSource = new MatTableDataSource<any>([])
  idProveedor = ''

  constructor(
    public readonly user: UserService,
    public readonly provider: ProvidersService,
    private readonly confirm: FuseConfirmationService,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.idProveedor = this.provider.id
    this.listContact(this.provider.id)
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  addModal() {
    const _$ = this.matDialog.open(NewUbicacionComponent, {
      width: '500px',
      height: 'calc(100vh - 100px)',
      data: {
        idprovee: this.idProveedor,
      },
    })

    _$.afterClosed().subscribe((result) => {
      if (result) {
        this.listContact(this.idProveedor)
      }
    })
  }
  updateModal(item: any) {
    const _$ = this.matDialog.open(NewUbicacionComponent, {
      width: '500px',
      data: {
        item: item,
        idProvee: this.idProveedor,
      },
    })

    _$.afterClosed().subscribe((result) => {
      if (result) {
        this.listContact(this.idProveedor)
      }
    })
  }
  listContact(id: string) {
    this.ubicacionSvc.getListadoUbi(id).subscribe((resp) => {
      if (resp.data) {
        if (resp.data.length > 0) {
          this.dataSource.data = resp.data
        } else {
          this.dataSource.data = []
        }
      } else {
        this.dataSource.data = []
      }
    })
  }

  deleteContact(params: string) {
    const dialogRef = this.confirm.open({
      title: this.transloco.translate('eliminacion.titulo'), // Traducción del título
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
        this.ubicacionSvc.deleteUbi(params).subscribe((resp) => {
          if (resp.statusCode == 200) {
            this.listContact(this.idProveedor)
          }
        })
      }
    })
  }
}

import { CommonModule } from '@angular/common'
import { Component, inject, ViewChild } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatIcon } from '@angular/material/icon'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { NewServiceComponent } from '../modals/new-service/new-service.component'
import { MatDialog } from '@angular/material/dialog'
import { DialogModule } from '@angular/cdk/dialog'
import { MarcaService } from '@fuse/services/providers/marca.service'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { ActivatedRoute } from '@angular/router'
import { UserService } from 'app/core/user/user.service'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'

@Component({
  selector: 'app-data-products',
  templateUrl: './data-products.component.html',
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
    MatPaginatorModule,
    TranslocoModule,
  ],
})
export class DataProductsComponent {
  displayedColumns: string[] = ['nombre', 'producto', 'descripcion', 'actions']
  matDialog = inject(MatDialog)
  marcaSvc = inject(MarcaService)
  router = inject(ActivatedRoute)
  @ViewChild(MatPaginator) paginator: MatPaginator
  dataSource = new MatTableDataSource<any>([])
  idProveedor = ''

  constructor(
    public readonly user: UserService,
    public readonly provider: ProvidersService,
    private readonly confirm: FuseConfirmationService,
    private transloco:TranslocoService
  ) {}

  ngOnInit(): void {
    this.idProveedor = this.provider.id
    this.listMarca(this.provider.id)
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  addModal() {
    const _$ = this.matDialog.open(NewServiceComponent, {
      width: '500px',
      //   height:'calc(100vh - 100px)',
      data: {
        idprovee: this.idProveedor,
      },
    })

    _$.afterClosed().subscribe((result) => {
      if (result) {
        this.listMarca(this.idProveedor)
      }
    })
  }
  updateModal(item: any) {
    const _$ = this.matDialog.open(NewServiceComponent, {
      width: '500px',
      //   height:'calc(100vh - 100px)',
      data: {
        item: item,
        idProvee: this.idProveedor,
      },
    })

    _$.afterClosed().subscribe((result) => {
      if (result) {
        this.listMarca(this.idProveedor)
      }
    })
  }
  listMarca(id: string) {
    this.marcaSvc.getListadoMarca(id).subscribe((resp) => {
      if (resp.data?.length > 0) {
        this.dataSource.data = resp.data
      } else this.dataSource.data = []
    })
  }

  deleteMarca(params: string) {
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
        this.marcaSvc.deleteMarca(params).subscribe((resp) => {
          if (resp.statusCode == 200) {
            this.listMarca(this.idProveedor)
          }
        })
      }
    })
  }
}

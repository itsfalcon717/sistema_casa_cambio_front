import { DialogModule } from '@angular/cdk/dialog'
import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatDialog } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { NewCatalogoComponent } from '../modals/new-catalogo/new-catalogo.component'
import { CatalogoService } from '@fuse/services/providers/catalogo.service'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { ActivatedRoute } from '@angular/router'
import { UserService } from 'app/core/user/user.service'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'

@Component({
  selector: 'app-data-catalogo',
  standalone: true,
  templateUrl: './data-catalogo.component.html',
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
export class DataCatalogoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['type', 'file', 'actions']
  matDialog = inject(MatDialog)
  router = inject(ActivatedRoute)
  catalogoSvc = inject(CatalogoService)
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
    this.listCatalogo(this.idProveedor)
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  addModal() {
    const _$ = this.matDialog.open(NewCatalogoComponent, {
      width: '500px',
      data: {
        idprovee: this.idProveedor,
      },
    })

    _$.afterClosed().subscribe((result) => {
      if (result) {
        this.listCatalogo(this.idProveedor)
      }
    })
  }
  updateModal(item: any) {
    const _$ = this.matDialog.open(NewCatalogoComponent, {
      width: '500px',
      data: {
        item: item,
        idProvee: this.idProveedor,
      },
    })

    _$.afterClosed().subscribe((result) => {
      if (result) {
        this.listCatalogo(this.idProveedor)
      }
    })
  }
  listCatalogo(id: string) {
    this.catalogoSvc.getListadoCatalogo(id).subscribe((resp) => {
      if (resp.data?.length > 0) {
        this.dataSource.data = resp.data
      } else {
        this.dataSource.data = []
      }
    })
  }

  deleteCatalogo(params: string) {
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
        this.catalogoSvc.deleteCatalogo(params).subscribe((resp) => {
          this.listCatalogo(this.idProveedor)
        })
      }
    })
  }

  descargarArchivo(item) {
    this.catalogoSvc.descargaArchivoRespuesta(item).subscribe((resp) => {
      if (resp.statusCode == 200) {
        const nombreArchivo = resp.data.nombre
        const archivoBase64 = resp.data.archivo64

        const contentType = archivoBase64.split(',')[0].split(':')[1].split(';')[0]

        const base64Data = archivoBase64.split(',')[1]

        const blob = this.base64ToBlob(base64Data, contentType)

        // Creamos un enlace de descarga
        const enlace = document.createElement('a')
        enlace.href = URL.createObjectURL(blob)
        enlace.download = nombreArchivo

        enlace.click()

        URL.revokeObjectURL(enlace.href)
      }
    })
  }

  base64ToBlob(base64Data, contentType) {
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: contentType })
  }
}

import { CommonModule } from '@angular/common'
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'
import { UserService } from 'app/core/user/user.service'
import { InvoicesStoreService } from '../services/invoices.store'
import { DoInvoiceComponent } from '../do-invoice/do-invoice.component'
import { InvoicesService } from '../services/invoices.service'
import { MatIconModule } from '@angular/material/icon'
import { SelectFileComponent } from '../modals/select-file/select-file.component'
import { saveAs } from 'file-saver'
import { ToastrService } from 'ngx-toastr'
import { ConfirmChangeComponent } from '../modals/confirm-change/confirm-change.component'
import { catchError } from 'rxjs'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { DetailEmComponent } from '../modals/detail-em/detail-em.component'

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    RouterModule,
  ],
})
export class InvoiceDetailComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator

  type: string
  displayedColumns = ['item', 'codprod', 'idAmarre', 'description', 'quantity', 'price', 'total', 'actions']
  displayedColumns2 = ['archivoRes', 'type', 'actions']
  matDialog = inject(MatDialog)
  migoStore = inject(InvoicesStoreService)
  dataSource = new MatTableDataSource<any>([])
  dataSource2 = new MatTableDataSource<any>([])
  data: any
  dataInvoice: any
  files: any[] = []
  isPreview = false

  get fillXml() {
    return this.files.find((f: any) => f.type === 'xml')
  }

  get fillPdf() {
    return this.files.find((f: any) => f.type === 'pdf')
  }

  get fillDocx() {
    return this.files.find((f: any) => f.type === 'docx')
  }

  id: any
  society: any
  qParams: any

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    public readonly userService: UserService,
    private readonly combos$: InvoicesService,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly toastr: ToastrService,
    private readonly confirm: FuseConfirmationService,
    private readonly transloco: TranslocoService
  ) {
    this.type = activatedRoute.snapshot.paramMap.get('type')
  }

  ngOnInit(): void {
    this.isPreview = this.activatedRoute.snapshot?.data.preview
    const params = this.activatedRoute.snapshot.params
    this.id = +params.invoice
    this.society = +params.society

    if (this.activatedRoute.snapshot?.data.preview) {
      //
      this.combos$
        .obtenerPrefactura({
          idFactura: this.id,
        })
        .subscribe((response: any) => {
          this.dataInvoice = response?.data
          if (this.dataInvoice?.archivoXML) {
            this.files.push({
              archivoRes: this.dataInvoice.archivoXML,
              archivo64: this.dataInvoice.archivo64XML,
              type: 'xml',
              actions: true,
            })
            this.dataSource2.data = this.files
          }
          if (this.dataInvoice?.archivoPDF) {
            this.files.push({
              archivoRes: this.dataInvoice.archivoPDF,
              archivo64: this.dataInvoice.archivo64PDF,
              type: 'pdf',
              actions: true,
            })
          }
          if (this.dataInvoice?.archivoDOC) {
            this.files.push({
              archivoRes: this.dataInvoice.archivoDOC,
              archivo64: this.dataInvoice.archivo64DOC,
              type: 'docx',
              actions: true,
            })
          }

          this.combos$
            .obtenerGuiaCompra({
              idEmpresa: this.dataInvoice?.idEmpresa,
              op: this.dataInvoice?.opGuiaCompra,
            })
            .subscribe((response: any) => {
              this.data = response?.body
              this.dataSource.data = response?.body.detalle.map((e, key) => ({
                item: ++key,
                codprod: e.codigoProducto,
                description: e.nombreProducto,
                quantity: e.cantidadGuia,
                price: e.precioOC,
                total: e.precioOC * e.cantidadGuia,
                currency: e.unidad,
              }))
            })
        })
    } else {
      this.qParams = this.activatedRoute.snapshot.queryParams
      this.combos$
        .obtenerGuiaCompra({
          idEmpresa: this.society,
          op: this.id,
        })
        .subscribe((response: any) => {
          this.data = response?.body
          this.dataSource.data = response?.body.detalle.map((e, key) => ({
            item: ++key,
            codprod: e.codigoProducto,
            description: e.nombreProducto,
            quantity: e.cantidadGuia,
            price: e.precioOC,
            total: e.precioOC * e.cantidadGuia,
            currency: e.unidad,
          }))
        })
    }
  }

  do(type: string) {
    if (type) {
      const $dialog = this.matDialog.open(SelectFileComponent, {
        width: '400px',
        data: {
          type,
        },
      })
      $dialog.afterClosed().subscribe((data) => {
        if (data?.type) {
          this.files.push({
            ...data,
            actions: true,
          })
          this.dataSource2.data = this.files
          this.cdr.detectChanges()
        }
      })
    } else {
      if (this.files.length !== 3) {
        this.toastr.error('Error de validación', 'Faltan archivos por cargar')
        return
      }

      const body = {
        id: 0,
        idEmpresa: +this.society,
        idProveedor: +this.userService.currentUser.idProveedor,
        opOrdenCompra: +this.qParams.opOrdenCompra,
        opGuiaCompra: +this.qParams.opGuiaCompra,
        serieGuia: this.data.serie,
        serieNumero: this.data.numero,
        archivoXML: this.fillXml.archivoRes,
        archivo64XML: this.fillXml.archivo64,
        archivoPDF: this.fillPdf.archivoRes,
        archivo64PDF: this.fillPdf.archivo64,
        archivoDOC: this.fillDocx.archivoRes,
        archivo64DOC: this.fillDocx.archivo64,
      }

      this.combos$.cargarPreFactura(body).subscribe(() => {
        this.toastr.success('Proceso finalizado con exito')
        const id = 1
        this.router.navigate(['/invoices/preview/' + id])
      })
    }
  }

  deleteItem(e: any) {
    this.files = this.files.filter((f) => f.archivoRes !== e.archivoRes)
    this.dataSource2.data = this.files
    this.cdr.detectChanges()
  }

  reject() {
    const dialog = this.matDialog.open(ConfirmChangeComponent, {
      width: '500px',
    })

    dialog.afterClosed().subscribe((data) => {
      if (data?.value) {
        this.combos$
          .aprobarPreFactura({
            idFactura: 1,
            estado: 0,
            observacion: data?.value,
            usuario: this.userService.currentUser?.usuario,
          })
          .pipe(
            catchError((error: any) => {
              this.toastr.error('Ocurrio un error al procesar')
              return error
            })
          )
          .subscribe(() => {})
      }
    })
  }

  openMd() {
    const dialog = this.matDialog.open(DetailEmComponent, {
      width: '400px',
      data: {},
    })

    dialog.afterClosed().subscribe((data: any) => {
      console.log(data)
    })
  }

  approve() {
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
        this.combos$
          .aprobarPreFactura({
            idFactura: 1,
            estado: 1,
            observacion: '',
            usuario: this.userService.currentUser?.usuario,
          })
          .pipe(
            catchError((error: any) => {
              this.toastr.error('Ocurrio un error al procesar')
              return error
            })
          )
          .subscribe(() => {})
      }
    })
  }

  download(element: any) {
    saveAs(new Blob([new Uint8Array(element.archivo64)]), element.archivoRes)
  }
}

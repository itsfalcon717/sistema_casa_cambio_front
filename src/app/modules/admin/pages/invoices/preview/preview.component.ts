import { CommonModule } from '@angular/common'
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { TranslocoModule } from '@ngneat/transloco'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { differenceInCalendarDays, lightFormat } from 'date-fns'
import { TableProviderComponent } from '../table-provider/table-provider.component'
import { ToastrService } from 'ngx-toastr'
import { InvoicesService } from '../services/invoices.service'
import { UserService } from 'app/core/user/user.service'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { CombosService } from '../../providers/services/combos.service'
import { MatTabsModule } from '@angular/material/tabs'
@Component({
  selector: 'app-migohes-preview',
  templateUrl: './preview.component.html',
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
    MatDatepickerModule,
    MatNativeDateModule,
    TableProviderComponent,
    MatTabsModule,
  ],
  providers: [InvoicesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  isAdmin: boolean = true // Cambia esto según el perfil del usuario
  maxFechaFin: Date | null = null
  documentType = []
  fb = inject(FormBuilder)
  user = inject(UserService)
  provider = inject(ProvidersService)
  toastr = inject(ToastrService)
  requests = inject(InvoicesService)
  _comboSvc = inject(CombosService)
  today = new Date()
  types = [
    {
      id: 0,
      label: 'Migo',
      columns: [
        'numeroGuia',
        'opGuiaCompra',
        'opSolicitudCompra',
        'nombreProveedor',
        'fechaGuiaCompra',
        'moneda',
        'estadoGuia',
        'actions',
      ],
    },
    {
      id: 1,
      label: 'HESS',
      columns: ['nroSolped', 'nombreProveedor', 'fechaGuiaCompra', 'moneda', 'estadoGuia', 'actions'],
    },
  ]
  invoicesColumns = ['opGuiaCompra', 'idProveedor', 'fechaEmision', 'nroFactura', 'nroSolicitud', 'actions']
  fg = this.fb.group({
    idEmpresa: ['1'],
    nroOC: [''],
    nroGuiaCompra: [''],
    nroDocumento: [''],
    nroSolicitud: [''],
    fechaInicial: [this.today],
    fechaFinal: [this.today],
  })
  fg2 = this.fb.group({
    idEmpresa: ['1'],
    factura: [''],
    ruc: [''],
    categoria: [''],
    estado: [''],
    fechaDesde: [this.today],
    fechaHasta: [this.today],
  })
  filtering = false
  dataSource = new MatTableDataSource<any>([])
  data = signal([])
  dataInvoices = signal([])
  loading = signal(false)
  fgType = new FormControl(this.types[1]?.id)

  get fcFrom() {
    return this.fg.get('fechaInicial')
  }

  get fcTo() {
    return this.fg.get('fechaFinal')
  }

  getColumns() {
    return this.types.find((f) => f.id === +this.fgType.value)?.columns
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  ngOnInit(): void {
    this.getData()
    this.getInvoices()
    this.getListadoEmpresa()
  }

  clearFilters() {
    this.fg.reset()

    this.data.update(() => [])

    this.fg.get('nroGuiaCompra').setValue('')
    this.fg.get('nroDocumento').setValue('')
    this.fg.get('nroSolicitud').setValue('')
    this.fg.get('nroOC').setValue('')

    this.fg.get('idEmpresa').setValue('1')
    this.fg.get('fechaInicial').setValue(this.today)
    this.fg.get('fechaFinal').setValue(this.today)

    this.getData()
  }

  empresa = []
  getListadoEmpresa() {
    this._comboSvc.listarEmpresa().subscribe((resp) => {
      this.empresa = resp.data
    })
  }

  getData() {
    this.data.update(() => [])

    this.loading.update(() => true)

    const body: any = this.fg.getRawValue()
    if (this.user.isProvider) {
      body.nroDocumento = this.user.currentUser.ruc
    }
    body.idEmpresa = +body.idEmpresa
    body.fechaFinal = lightFormat(body.fechaFinal, 'dd/MM/yyyy')
    body.fechaInicial = lightFormat(body.fechaInicial, 'dd/MM/yyyy')

    this.requests.consultaGuiaCompra(body).subscribe((data) => {
      this.data.update(() => data?.body)
      this.loading.update(() => false)
    })
  }

  getInvoices() {
    this.data.update(() => [])

    this.loading.update(() => true)

    const body: any = this.fg2.getRawValue()

    if (this.user.isProvider) {
      body.ruc = this.user.currentUser.ruc
    }

    body.idEmpresa = +body.idEmpresa
    body.fechaHasta = lightFormat(body.fechaHasta, 'dd/MM/yyyy')
    body.fechaDesde = lightFormat(body.fechaDesde, 'dd/MM/yyyy')

    this.requests.listarPreFactura(body).subscribe((data) => {
      this.dataInvoices.update(() => data?.data)
      this.loading.update(() => false)
    })
  }

  doFilter() {
    const diff = differenceInCalendarDays(this.fcTo.value, this.fcFrom.value)

    this.filtering = true
    this.getData()

    // if (diff <= 90) {
    //   this.filtering = true
    //   this.getData()
    // } else {
    //   this.toastr.error('Error', 'Máximo 3 meses')
    // }
  }

  doFilterInvoices() {
    const diff = differenceInCalendarDays(this.fcTo.value, this.fcFrom.value)

    this.filtering = true
    this.getInvoices()

    // if (diff <= 90) {
    //   this.filtering = true
    //   this.getInvoices()
    // } else {
    //   this.toastr.error('Error', 'Máximo 3 meses')
    // }
  }
}

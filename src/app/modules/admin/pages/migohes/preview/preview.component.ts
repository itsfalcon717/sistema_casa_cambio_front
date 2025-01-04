import { CommonModule } from '@angular/common'
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
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
import { addMonths, differenceInCalendarDays, lightFormat } from 'date-fns'
import { TableProviderComponent } from '../table-provider/table-provider.component'
import { ToastrService } from 'ngx-toastr'
import { MigohesService } from '../services/migohes.service'
import { MigohesStoreService } from '../services/migohes.store'
import { UserService } from 'app/core/user/user.service'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { CombosService } from '../../providers/services/combos.service'
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
  ],
  providers: [MigohesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  isAdmin: boolean = true // Cambia esto según el perfil del usuario
  maxFechaFin: Date | null = null
  displayedColumns: string[] = [
    'solped',
    'nroOC',
    'nombreProveedor',
    'fechaDoc',
    'fechaPub',
    'total',
    'status',
    'actions',
  ]
  fb = inject(FormBuilder)
  user = inject(UserService)
  provider = inject(ProvidersService)
  toastr = inject(ToastrService)
  requests = inject(MigohesService)
  _comboSvc = inject(CombosService)
  today = new Date()
  fg = this.fb.group({
    idEmpresa: ["1", [Validators.required]],
    nroOC: [''],
    nroGuiaCompra: [''],
    nroDocumento: [''],
    nroSolicitud: [''],
    fechaInicial: [this.today, [Validators.required]],
    fechaFinal: [this.today, [Validators.required]],
  })
  filtering = false
  dataSource = new MatTableDataSource<any>([])
  data = signal([])
  loading = signal(false)

  get fcFrom() {
    return this.fg.get('fechaInicial')
  }

  get fcTo() {
    return this.fg.get('fechaFinal')
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  ngOnInit(): void {
    this.getData()
    this.getListadoEmpresa()
    this.updateFechaFinLimit()

    this.fcFrom.valueChanges.subscribe(() => this.checkDiff())
    this.fcTo.valueChanges.subscribe(() => this.checkDiff())
  }

  clearFilters() {
    this.fg.reset()

    this.data.update(() => [])

    this.fg.get('nroGuiaCompra').setValue('')
    this.fg.get('nroDocumento').setValue('')
    this.fg.get('nroSolicitud').setValue('')
    this.fg.get('nroOC').setValue('')

    this.fg.get('idEmpresa').setValue("1")
    this.fg.get('fechaInicial').setValue(this.today)
    this.fg.get('fechaFinal').setValue(this.today)

    this.getData()
  }

  empresa = []

  get company() {
    return this.fg.get('idEmpresa').value
  }

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

  checkDiff() {
    const diff = differenceInCalendarDays(this.fcTo.value, this.fcFrom.value)
    if (!this.fg.get('nroDocumento').value) {
      if (diff > 93) {
        this.toastr.error('Error de validación', 'Máximo 3 meses')
        return false
      }
    }

    return true
  }

  doFilter() {
    if (this.checkDiff()) {
      this.filtering = true
      this.getData()
    }
  }

  updateFechaFinLimit() {
    this.fg.get('fechaInicial')?.valueChanges.subscribe((fechaInicio) => {
      if (fechaInicio) {
        const fechaInicioDate = new Date(fechaInicio)
        this.maxFechaFin = addMonths(fechaInicioDate, 3)
      }
    })
  }
}

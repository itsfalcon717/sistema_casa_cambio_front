import { CommonModule } from '@angular/common'
import { Component, OnInit, signal } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatFormField } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSliderModule } from '@angular/material/slider'
import { MatTabsModule } from '@angular/material/tabs'
import { CombosService } from '../../services/combos.service'
import { ResponseCombo } from '../../models/combo'
import { ProvidersRequestsService } from '@fuse/services/providers'
import { ActivatedRoute, Router } from '@angular/router'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { UserService } from 'app/core/user/user.service'
import { NgxMaskDirective } from 'ngx-mask'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'
import { concatAll, from, map } from 'rxjs'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-data-general',
  templateUrl: './data-general.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckbox,
    MatButton,
    MatIcon,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatSliderModule,
    MatSlideToggleModule,
    NgxMaskDirective,
    TranslocoModule,
  ],
})
export class DataGeneralComponent implements OnInit {
  constructor(
    private readonly _comboSvc: CombosService,
    private readonly _providersSvc: ProvidersRequestsService,
    private readonly _fb: FormBuilder,
    private readonly _router: ActivatedRoute,
    private readonly provider: ProvidersService,
    public readonly user: UserService,
    public readonly toastr: ToastrService,
    private readonly transloco: TranslocoService
  ) {}

  regiones: any = []
  provincias: any = []
  distritos: any = []
  pais: any = []
  estadoProv: any = []
  tipoProv: any = []
  flgSunatActivo: any = false
  flgSunarHabido: any = false
  flgTipoVentaBienes: any = false
  flgTipoVentaServicio: any = false
  flgTipoFacElect: any = false
  flgTipoFacManual: any = false
  isLoading = signal(false)
  fb = this._fb.group({
    id: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idProveedor: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idCategoria: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    categoria: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idTipoContribuyente: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idTipoDocumento: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    tipoDocumento: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    proveedorGiroNegocio: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    giroNegocio: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idRamaNegocio: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    ramaNegocio: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idTipo: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    nombre: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idDistrito: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    distrito: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idProvincia: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    provincia: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idRegion: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    region: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idPais: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    pais: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idOperacionesAfectadas: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    operacionesAfectadas: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idEstado: [
      {
        value: '',
        disabled: true,
      },
      Validators.required,
    ],
    estado: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    ruc: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    razonSocial: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    nombreComercial: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    direccionFiscal: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    paginaWeb: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    codigoPostal: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    sunatActivo: [
      {
        value: '',
      },
      Validators.required,
    ],
    correo: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), Validators.required],
    ],
    sunarHabido: [
      {
        value: '',
      },
      Validators.required,
    ],
    sunatCorreo: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), Validators.required],
    ],
    aceptaEnvio: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    aceptaPolitias: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    fecConstitucion: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    ventaBienes: [
      {
        value: 0,
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    ventaServicios: [
      {
        value: 0,
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    facElectronica: [
      {
        value: 0,
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    facManual: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    idCondicionPago: [
      {
        value: '',
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    tipoMoneda: [
      {
        value: [],
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    tipoComprobante: [
      {
        value: [],
        disabled: !this.user.isProvider,
      },
      Validators.required,
    ],
    direccion: [
      {
        value: [],
        disabled: !this.user.isProvider,
      },
    ],
    correoDetraccion: [
      {
        value: [],
        disabled: !this.user.isProvider,
      },
      [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), Validators.required],
    ],
    proveedorCategoria: [
      {
        value: [],
        disabled: !this.user.isProvider,
      },
    ],
  })
  usuario: any

  parsedCategories = signal([])

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('userData'))
    this.listProviderXid(this.provider.id)
  }

  listTipoProve() {
    return this._comboSvc.getListadoTipoProv().pipe(
      map((resp) => {
        this.tipoProv = resp.data
      })
    )
  }

  listEstProve() {
    return this._comboSvc.getListadoEstProv().pipe(
      map((resp) => {
        this.estadoProv = resp.data
      })
    )
  }

  category = []
  listCategories() {
    return this._comboSvc.getListadoCatProv().pipe(
      map((response) => {
        this.category = response.data
      })
    )
  }

  giroProv = []

  listGiro(id) {
    return this._comboSvc.getListadoGiroNegocio(id).pipe(
      map((resp) => {
        this.giroProv = resp.data
      })
    )
  }

  operationsType = []

  getListadoOpeAfect() {
    return this._comboSvc.getListadoOpeAfect().pipe(
      map((resp) => {
        this.operationsType = resp.data
      })
    )
  }

  paymentConditions = []

  listpaymentConditions() {
    return this._comboSvc.getListadoCondicionPago().pipe(
      map((resp) => {
        this.paymentConditions = resp.data
      })
    )
  }

  voucherType = []

  listVoucherType(id) {
    return this._comboSvc.getListadoComprobante(id).pipe(
      map((resp) => {
        this.voucherType = resp.data
      })
    )
  }

  currency = []

  getListadoTipoMone(id) {
    return this._comboSvc.getListadoTipoMone(id).pipe(
      map((resp) => {
        this.currency = resp.data
      })
    )
  }

  contribuyente = []

  listarTipoContribuyente() {
    return this._comboSvc.listarTipoContribuyente().pipe(
      map((resp) => {
        this.contribuyente = resp.data
      })
    )
  }

  listPais() {
    return this._comboSvc.getListadoPais().pipe(
      map((resp) => {
        this.pais = resp.data
        this.cargarRegiones()
      })
    )
  }

  cargarRegiones() {
    this._comboSvc.getListadoRegiones().subscribe(
      (response: ResponseCombo) => {
        if (response.statusCode === 200) {
          this.regiones = response.data // Suponiendo que 'data' contiene la lista de regiones
        } else {
          console.error(response.message)
        }
      },
      (error) => {
        console.error('Error al cargar las regiones:', error)
      }
    )
  }

  getcargarProvincias(idRegion: string) {
    this.cargarProvincias(idRegion).subscribe()
  }

  cargarProvincias(idRegion: string) {
    this.distritos = []
    this.provincias = []
    return this._comboSvc.getListadoProvincia(idRegion).pipe(
      map((response: ResponseCombo) => {
        if (response.statusCode === 200) {
          this.provincias = response.data
        } else {
          console.error(response.message)
        }
      })
    )
  }

  getcargarDistritos(idProvincia: string) {
    this.cargarDistritos(idProvincia).subscribe()
  }

  cargarDistritos(idProvincia: string) {
    // this.valueDistrito = ''
    this.distritos = []
    return this._comboSvc.getListadoDistrito(idProvincia).pipe(
      map((response: ResponseCombo) => {
        if (response.statusCode === 200) {
          this.distritos = response.data
        } else {
          console.error(response.message)
        }
      })
    )
  }

  flg_tipo_pro = true
  cData: any = {}

  listProviderXid(id: string) {
    this._providersSvc.listProvidersXid(id).subscribe((resp: any) => {
      from([
        this.listCategories(),
        this.listTipoProve(),
        this.listEstProve(),
        this.listPais(),
        this.listGiro(this.provider.id),
        this.getListadoTipoMone(this.provider.id),
        this.listVoucherType(this.provider.id),
        this.listpaymentConditions(),
        this.getListadoOpeAfect(),
        this.listarTipoContribuyente(),
      ])
        .pipe(concatAll())
        .subscribe(() => {
          this.cData = { ...resp.data }
          this.provider.provider = resp.data
          this.flg_tipo_pro = resp.data.idTipo
          this.flgSunatActivo = resp.data.sunatActivo
          this.flgSunarHabido = resp.data.sunarHabido

          if (resp.data.proveedorCategoria?.length) {
            this.parsedCategories.update(() =>
              resp.data.proveedorCategoria?.map((e) => this.category.find((f) => f.id == e)?.nombre)
            )
          }

          this.flgTipoVentaBienes = resp.data.ventaBienes
          this.flgTipoVentaServicio = resp.data.ventaServicios
          this.flgTipoFacElect = resp.data.facElectronica
          this.flgTipoFacManual = resp.data.facManual

          if (resp.data.idRegion) {
            from([this.cargarProvincias(resp.data.idRegion), this.cargarDistritos(resp.data.idProvincia)])
              .pipe(concatAll())
              .subscribe(() => {
                this.isLoading.update(() => true)
                this.fb.patchValue(resp.data)
              })
          } else {
            this.isLoading.update(() => true)
            this.fb.patchValue(resp.data)
          }
        })
    })
  }

  doUpdate(event: any) {
    const p1: any = this.fb.value?.proveedorCategoria;
    const p2: any = this.cData?.proveedorCategoria
    if (p1?.toString() != p2?.toString()) this.actualizar()
  }

  actualizar() {
    this.fb.value.ventaBienes = this.flgTipoVentaBienes
    this.fb.value.ventaServicios = this.flgTipoVentaServicio
    this.fb.value.facElectronica = this.flgTipoFacElect
    this.fb.value.facManual = this.flgTipoFacManual

    const idCat = this.fb.get('proveedorCategoria').value || []
    if (idCat?.length) {
      this._providersSvc
        .updateProviders({
          ...this.provider.currentProvider,
          ...this.fb.value,
        })
        .subscribe((resp) => this.listProviderXid(this.provider.id))
    } else {
      this.toastr.info(this.transloco.translate('toast.incompletecategory'))
    }
  }

  changeOption(option: number, value) {
    switch (option) {
      case 1:
        this.flgTipoVentaBienes = value.checked
        break
      case 2:
        this.flgTipoVentaServicio = value.checked
        break
      case 3:
        this.flgTipoFacElect = value.checked
        break
      case 4:
        this.flgTipoFacManual = value.checked
        break
    }
  }
}

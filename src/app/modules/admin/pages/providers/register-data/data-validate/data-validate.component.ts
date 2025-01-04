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
import { TranslocoModule } from '@ngneat/transloco'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { ToastrService } from 'ngx-toastr'
import { FuseUtilsService } from '@fuse/services/utils'
import { concatAll, concatMap, forkJoin, from, map } from 'rxjs'

@Component({
  selector: 'app-data-validate',
  templateUrl: './data-validate.component.html',
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
    MatDatepickerModule,
  ],
})
export class DataValidateComponent implements OnInit {
  constructor(
    private readonly _comboSvc: CombosService,
    private readonly _providersSvc: ProvidersRequestsService,
    private readonly providerService: ProvidersService,
    private readonly _fb: FormBuilder,
    private readonly _router: ActivatedRoute,
    private readonly provider: ProvidersService,
    public readonly user: UserService,
    public readonly toastr: ToastrService,
    private readonly fuseUtils: FuseUtilsService
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
  fb = this._fb.group({
    idTipoContribuyente: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    proveedorGiroNegocio: [
      {
        value: [],
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    idTipo: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    idDistrito: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    idProvincia: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    idRegion: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    idPais: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    ruc: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    razonSocial: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    nombreComercial: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    direccionFiscal: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    paginaWeb: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    fecConstitucion: [
      {
        value: '',
        disabled: this.user.isAdmin,
      },
      Validators.required,
    ],
    proveedorEmpresa: [
      {
        value: [2, 3],
      },
      Validators.required,
    ],
  })
  isLoading = signal(false)
  loadingCompanies = signal(false)
  companies = signal([])
  ngOnInit(): void {
    from([
      this.listadoRamaNego(this.provider.id),
      this.listTipoProve(),
      this.listEstProve(),
      this.listPais(),
      this.cargarRegiones(),
      this.listGiro(this.provider.id),
      this.getListadoTipoMone(this.provider.id),
      this.listVoucherType(this.provider.id),
      this.listpaymentConditions(),
      this.getListadoOpeAfect(),
      this.listarTipoContribuyente(),
      this.getListadoEmpresa(),
      this.listCompanies(),
    ])
      .pipe(concatAll())
      .subscribe(() => {
        this.listProviderXid(this.provider.id).subscribe((resp: any) => {
          if (resp.data.idRegion) {
            this.cargarProvincias(resp.data.idRegion)
          }

          if (resp.data.idProvincia) {
            this.cargarDistritos(resp.data.idProvincia)
          }
        })
      })
  }
  all = false
  getCompany(id) {
    return this.empresa.find((f) => f.id === id)?.nombre
  }
  get cValue() {
    return this.fb.get('proveedorEmpresa').value
  }
  toggleAll() {
    if (!this.all) {
      this.all = true
      this.fb.get('proveedorEmpresa').setValue(['all', ...this.empresa.map((c: any) => c.id)])
    } else {
      this.all = false
      this.fb.get('proveedorEmpresa').setValue([])
    }
  }
  companyExists(company: number) {
    return this.companies()?.find((f) => f == company)
  }
  societies = []
  idSelected(id: number) {
    this.loadingCompanies.update(() => true)
    const body = {
      idProveedor: +this.provider.id,
      proveedorEmpresa: id,
      accion: !this.companyExists(id) ? '0' : '1',
    }
    this.societies.push(body)
  }

  getSelecteds() {
    const cVal = this.cValue.filter((f: any) => f !== 'all')
    return cVal.filter((e) => this.companies().indexOf(e) === -1)
  }

  getRemoves() {
    const cVal = this.cValue.filter((f: any) => f !== 'all')
    return this.companies().filter((e) => cVal.indexOf(e) === -1)
  }

  listCompanies() {
    return this._providersSvc
      .listarProveedorEmpresa({
        id: this.provider.id,
      })
      .pipe(
        map((response: any) => {
          const companies = response.data ? response.data : []
          this.companies.update(() => companies?.map((e) => e.proveedorEmpresa))
          //   this.fb.get('proveedorEmpresa').setValue(companies?.map((e) => e.proveedorEmpresa))
        })
      )
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
  giroProv = []
  listGiro(id) {
    return this._comboSvc.getListadoGiroNegocio(id).pipe(
      map((resp) => {
        this.giroProv = resp.data
      })
    )
  }
  ramas = []
  listadoRamaNego(id) {
    return this._comboSvc.getListadoRamaNego(id).pipe(
      map((resp) => {
        this.ramas = resp.data
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
  empresa = []
  getListadoEmpresa() {
    return this._comboSvc.listarEmpresa().pipe(
      map((resp) => {
        this.empresa = resp.data
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
      })
    )
  }
  cargarRegiones() {
    return this._comboSvc.getListadoRegiones().pipe(
      map((response: ResponseCombo) => {
        if (response.statusCode === 200) {
          this.regiones = response.data // Suponiendo que 'data' contiene la lista de regiones
        } else {
          console.error(response.message)
        }
      })
    )
  }

  get currentUser() {
    return this.user.currentUser
  }

  get currentProvider() {
    return this.provider.currentProvider
  }
  cargarProvincias(idRegion: string) {
    this.distritos = []
    this.provincias = []
    this._comboSvc.getListadoProvincia(idRegion).subscribe(
      (response: ResponseCombo) => {
        if (response.statusCode === 200) {
          this.provincias = response.data
        } else {
          console.error(response.message)
        }
      },
      (error) => {
        console.error('Error al cargar las provincias:', error)
      }
    )
  }

  cargarDistritos(idProvincia: string) {
    // this.valueDistrito = ''
    this.distritos = []
    this._comboSvc.getListadoDistrito(idProvincia).subscribe(
      (response: ResponseCombo) => {
        if (response.statusCode === 200) {
          this.distritos = response.data
        } else {
          console.error(response.message)
        }
      },
      (error) => {
        console.error('Error al cargar los distritos:', error)
      }
    )
  }
  flg_estado = ''
  sended = signal(false)
  listProviderXid(id: string) {
    return this._providersSvc.listProvidersXid(id).pipe(
      map((resp: any) => {
        this.flg_estado = resp.data.estado
        this.fb.patchValue(resp.data)

        this.providerService.provider = resp.data

        this.flgSunatActivo = resp.data.sunatActivo
        this.flgSunarHabido = resp.data.sunarHabido

        return resp
      })
    )
  }
  actualizar($ev) {
    if (!$ev) {
      const $req: any = []

      if (!this.getSelecteds().length && !this.getRemoves().length) {
        return false
      }

      const body = {
        ...this.providerService.currentProvider,
      }

      body.proveedorEmpresa = this.fb.get('proveedorEmpresa').value.filter((f: any) => f !== 'all')

      from([this._providersSvc.updateProviders(body)])
        .pipe(concatAll())
        .subscribe((resp) => {
          this.societies = []
          this.listCompanies().subscribe(() => {
            this.listProviderXid(this.provider.id).subscribe()
          })
        })
    }
  }
  enviarErp() {
    this.isLoading.update(() => true)
    this._providersSvc.sendErp(this.provider.id).subscribe((resp: any) => {
      this.isLoading.update(() => false)
      if (resp.statusCode == 200) {
        const messageData = JSON.parse(resp.message)
        if (messageData.status == 400) {
          this.toastr.error('Error', messageData.message)
        } else {
          this.toastr.success('Success', messageData.message)
        }
      }
    })
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

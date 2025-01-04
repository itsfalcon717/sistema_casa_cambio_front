import { AsyncPipe, CommonModule, NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, DebugElement, OnInit, signal } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatIcon } from '@angular/material/icon'
import { MatTabsModule } from '@angular/material/tabs'
import { DataGeneralComponent } from './data-general/data-general.component'
import { DataVerifyComponent } from './data-verify/data-verify.component'
import { DataProductsComponent } from './data-products/data-products.component'
import { DataCatalogComponent } from './data-catalog/data-catalog.component'
import { DataBankComponent } from './data-bank/data-bank.component'
import { DataContactsComponent } from './data-contacts/data-contacts.component'
import { DataCatalogoComponent } from './data-catalogo/data-catalogo.component'
import { UserService } from 'app/core/user/user.service'
import { ProvidersRequestsService } from '@fuse/services/providers'
import { ActivatedRoute, Router } from '@angular/router'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { DataValidateComponent } from './data-validate/data-validate.component'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'
import { DataUbicacionComponent } from './data-ubicacion/data-ubicacion.component'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmChangeComponent } from './modals/confirm-change/confirm-change.component'
import { ToastrService } from 'ngx-toastr'
import { ContactoService } from '@fuse/services/providers/contacto.service'
import { map } from 'rxjs'
import { ConfirmEvaluateComponent } from './modals/confirm-evaluate/confirm-evaluate.component'
import { CombosService } from '../services/combos.service'

@Component({
  selector: 'app-register-data',
  templateUrl: './register-data.component.html',
  standalone: true,
  styles: `
    .percentage {
        width: 100%;
        height: 25px;
        border-radius: 10px;
        background: #fff;
        position: relative;
        overflow: hidden;
        p, span {
            position: absolute;
            font-size: 13px;
        }
        > div {
            position: absolute;
            min-width: 50px;
            width: 50%;
            height: 100%;
            background: #7f9e1e;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
            color: #fff;
        }
    }


  `,
  imports: [
    CommonModule,
    NgIf,
    MatCheckbox,
    MatButton,
    MatIcon,
    MatTabsModule,
    ReactiveFormsModule,
    AsyncPipe,
    FormsModule,
    DataGeneralComponent,
    DataVerifyComponent,
    DataProductsComponent,
    DataCatalogComponent,
    DataBankComponent,
    DataContactsComponent,
    DataCatalogoComponent,
    DataValidateComponent,
    DataUbicacionComponent,
    TranslocoModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterDataComponent implements OnInit {
  isLoading = signal(true)
  isAproved = signal(false)
  isRefuce = signal('')
  percentage = signal(0)
  providerName = signal('')

  constructor(
    public readonly userService: UserService,
    public readonly providerService: ProvidersService,
    private readonly _providersSvc: ProvidersRequestsService,
    private readonly requests: ProvidersRequestsService,
    private readonly router: Router,
    private readonly activatedRouter: ActivatedRoute,
    private matDialog: MatDialog,
    public readonly toastr: ToastrService,
    private readonly transloco: TranslocoService,
    private readonly contactoSvc: ContactoService,
    private readonly _comboSvc: CombosService
  ) {}

  ngOnInit(): void {
    this.providerService.providerId = this.activatedRouter.snapshot.paramMap.get('id')
    this.getProvider()

    this.providerService.$provider.subscribe((e) => {
      console.log(e)
      if (e) {
        this.isLoading.update(() => false)
        this.providerName.update(() => e.razonSocial)
        this.isAproved.update(() => e.estado === 'APROBADO')
        this.isRefuce.update(() => e.estado)
        this.estado = e.estado
        this.percentage.update(() => e.porcentaje)
      }
    })
  }

  contacts = []
  listContact(id: string) {
    return this.contactoSvc.getListadoPersona(id).pipe(
      map((resp) => {
        this.contacts = resp.data
      })
    )
  }

  sendSubsanar() {
    const confirm = this.matDialog.open(ConfirmChangeComponent, {
      width: '500px',
    })

    confirm.afterClosed().subscribe((cData: any) => {
      if (cData) {
        let req = {
          id: this.providerService.id,
          estado: 3,
          observacion: cData.value,
        }

        this.requests.changeState(req).subscribe((response: any) => {
          if (response.statusCode == 200) {
            this.getProvider()
          }
        })
      }
    })
  }
  estado: string = ''
  getProvider() {
    this.requests.listProvidersXid(this.providerService.id).subscribe((response: any) => {
      this.listarTipoPersona().subscribe((resp) => {
        this.tipoPersona = resp.data
        this.providerService.provider = response.data
        this.isLoading.update(() => false)
        this.providerName.update(() => response.data.razonSocial)
        this.isAproved.update(() => response.data.estado === 'APROBADO')
        this.isRefuce.update(() => response.data.estado)
        this.estado = response.data.estado
      })
    })
  }

  tipoPersona: any[] = []
  listarTipoPersona() {
    return this._comboSvc.getListadoTipoPersona().pipe()
  }

  sendToEvaluate(error, bool) {
    this.listContact(this.providerService.id).subscribe(() => {
      if (!this.isValidGeneralData()) {
        this.toastr.error(this.transloco.translate('toast.incompletegeneral'))
        error = true
        return false
      }

      if (this.isCompleteContacts()) {
        this.toastr.error(this.transloco.translate('toast.incompletecontacts'))
        error = true
        return false
      }

      if (!this.isValidContacts()) {
        this.toastr.error(this.transloco.translate('toast.invalidcontacts'))
        error = true
        return false
      }

      let req = {
        id: this.providerService.id,
        estado: bool,
        observacion: '',
      }
      this.requests.changeState(req).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.isRefuce.set('')
          this.getProvider()
        }
      })
    })
  }

  AproReject(bool: number) {
    let error = false
    this.providerService.providerId = this.activatedRouter.snapshot.paramMap.get('id')
    const current = this.providerService.currentProvider

    if (bool == 2) {
      const acepted = current.aceptaDJ && current.aceptaAD && current.aceptaDP
      if (acepted) {
        this.sendToEvaluate(error, bool)
      } else {
        const confirm = this.matDialog.open(ConfirmEvaluateComponent, {
          width: '700px',
        })

        confirm.afterClosed().subscribe(() => {
          this.sendToEvaluate(error, bool)
        })
      }
    }

    if (bool === 4) {
      const confirm = this.matDialog.open(ConfirmChangeComponent, {
        width: '500px',
      })
      confirm.afterClosed().subscribe((cData: any) => {
        if (cData) {
          this.providerService.providerId = this.activatedRouter.snapshot.paramMap.get('id')

          setTimeout(() => {
            let req = {
              id: this.providerService.id,
              estado: bool,
              observacion: cData.value,
            }
            this.requests.changeState(req).subscribe((response: any) => {
              if (response.statusCode == 200) {
                this.isRefuce.set('RECHAZADO')
                this.getProvider()
              }
            })
          }, 500)
        }
      })
    }

    if (bool === 3) {
      if (this.userService.isAdmin && !this.isValidProvider()) {
        this.toastr.error(this.transloco.translate('toast.invalidprovider'))
        return false
      }

      let req = {
        id: this.providerService.id,
        estado: bool,
        observacion: '',
      }
      this.requests.changeState(req).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.isRefuce.set('APROBADO')
          const messageData = JSON.parse(response.message)
          if (messageData.status == 400) {
            this.toastr.error('Error', messageData.message)
          } else {
            this.toastr.success('Success', messageData.message)
          }

          this.getProvider()
          this.isLoading.update(() => false)
        }
      })
    }
  }

  isCompleteContacts() {
    return this.contacts.filter((e) => !e.cargo || !e.telefono).length
  }

  isValidContacts() {
    return [...new Set(this.contacts.map((e) => e.idTipo))].length === this.tipoPersona.length
  }

  isValidGeneralData() {
    const { idTipoContribuyente, correo, ruc, razonSocial, nombreComercial, paginaWeb } =
      this.providerService.currentProvider

    return idTipoContribuyente && ruc && razonSocial && nombreComercial && paginaWeb && correo
  }

  isValidProvider() {
    const {
      idTipo,
      idTipoContribuyente,
      ruc,
      razonSocial,
      nombreComercial,
      direccionFiscal,
      idPais,
      idRegion,
      idDistrito,
      idProvincia,
      paginaWeb,
      //   ramaNegocio,
      fecConstitucion,
      proveedorEmpresa,
    } = this.providerService.currentProvider

    return (
      idTipo &&
      idTipoContribuyente &&
      ruc &&
      razonSocial &&
      nombreComercial &&
      direccionFiscal &&
      idPais &&
      idRegion &&
      idDistrito &&
      idProvincia &&
      paginaWeb &&
      //   ramaNegocio &&
      fecConstitucion &&
      proveedorEmpresa.length
    )
  }

  selectedTab = 0
  onTabChange(event: any) {
    this.selectedTab = event.index
  }

  indexTab = 0
  tabChanged($ev) {
    this.indexTab = $ev.index
  }

  selectedERP = false
  selectTab(tab: string) {
    this.selectedERP = true
  }
}

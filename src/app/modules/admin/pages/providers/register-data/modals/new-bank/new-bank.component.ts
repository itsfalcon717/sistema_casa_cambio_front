import { DialogRef } from '@angular/cdk/dialog'
import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, Inject, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton, MatButtonModule } from '@angular/material/button'
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogRef } from '@angular/material/dialog'
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSliderModule } from '@angular/material/slider'
import { MatTabsModule } from '@angular/material/tabs'
import { RouterModule } from '@angular/router'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { CuentasService } from '@fuse/services/providers/cuentas.service'
import { CombosService } from '../../../services/combos.service'
import { NgxMaskDirective } from 'ngx-mask'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'

@Component({
  selector: 'app-new-bank',
  templateUrl: './new-bank.component.html',
  // styles: [':host{display:contents}'], // Makes component host as if it was not there, can offer less css headaches. Use @HostBinding class approach for easier overrides.
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
export class NewBankComponent implements AfterViewInit, OnInit {
  tipoProv: any = []
  fg: FormGroup
  fb = inject(FormBuilder)
  dRef = inject(DialogRef<NewBankComponent>)
  dialogRef = inject(MatDialogRef<NewBankComponent>)
  cuentaSvc = inject(CuentasService)
  _comboSvc = inject(CombosService)
  fConfirm = inject(FuseConfirmationService)
  transloco = inject(TranslocoService)

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
  flg_edit: boolean = false
  idprovee = ''
  usuario: any
  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('userData'))
    this.listarPais()
    this.listartipoCuenta()
    this.listarEntidad()
    this.listTipoProve()
    this.getListadoTipoMone(this.usuario.id)
    this.fg = this.fb.group({
      id: [0],
      idProveedor: [0],
      idTipo: [1, Validators.required],
      idTipoPro: [1, Validators.required],
      idPais: [1, Validators.required],
      idEntidadBancaria: [1],
      idTipoMoneda: [1],
      moneda: [''],
      entidad: [''],
      cuenta: ['', Validators.required, Validators.pattern['^[0-9]+$']],
      cci: ['', Validators.required],
      swif: ['', Validators.maxLength(23)],
      aba: ['', Validators.maxLength(23)],
      iban: ['', Validators.maxLength(23)],
      contacto: ['', Validators.required],
    })

    this.fg.patchValue({
      idProveedor: this.dRef.config.data.idprovee,
      idTipoPro: this.usuario.idTipo,
    })

    if (this.dRef.config.data.item) {
      this.flg_edit = true
      this.fg.patchValue(this.dRef.config.data.item)
      this.onTipoChange()
      this.validateCciField(this.usuario.idTipo)
    } else {
      this.flg_edit = false
      this.onTipoChange()
      // Forzar validación del campo `cci` basado en el valor inicial de `idTipo`
      this.validateCciField(this.usuario.idTipo)
    }
  }
  // Llamar a esta función directamente desde ngOnInit si necesitas aplicar validaciones iniciales
  flg_tipoProveedor: number
  validateCciField(idTipo: number) {
    this.flg_tipoProveedor = idTipo
    const cci = this.fg.get('cci')
    if (idTipo === 1) {
      cci?.setValidators([Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(20)])
      cci?.updateValueAndValidity()
    } else if (idTipo === 2) {
      cci?.setValidators([Validators.pattern('^[a-zA-Z0-9]+$')])
      cci?.updateValueAndValidity()
    }
  }

  onTipoChange() {
    this.fg.get('idTipoPro')?.valueChanges.subscribe((idTipo) => {
      this.validateCciField(idTipo)
    })
  }
  doRegister() {
    if (this.fg.value.id == 0) {
      this.createCuenta()
    } else {
      this.updateCuenta()
    }
    // this.dRef.close()
  }
  tipoEntidad = []
  listarEntidad() {
    this._comboSvc.getListadoEntidadBan().subscribe((resp) => {
      this.tipoEntidad = resp.data
    })
  }
  pais = []
  listarPais() {
    this._comboSvc.getListadoPais().subscribe((resp) => {
      this.pais = resp.data
    })
  }
  tipoCuenta = []
  listartipoCuenta() {
    this._comboSvc.getListadoTipoCuenta().subscribe((resp) => {
      this.tipoCuenta = resp.data
    })
  }

  updateCuenta() {
    const { moneda, ...body } = this.fg.value
    this.cuentaSvc.updateCuenta(body).subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.dialogRef.close('SI')
      }
    })
  }
  createCuenta() {
    const { moneda, ...body } = this.fg.value
    this.cuentaSvc.postCuenta(body).subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.dialogRef.close('SI')
      }
    })
  }
  listTipoProve() {
    this._comboSvc.getListadoTipoProv().subscribe((resp) => {
      this.tipoProv = resp.data
    })
  }
  currency = []
  getListadoTipoMone(id) {
    this._comboSvc.getListadoTipoMone(id).subscribe((resp) => {
      this.currency = resp.data
    })
  }
  selectTipoProv(event) {
    this.getListadoTipoMone(event)
    this.onTipoChange()
    this.validateCciField(event)
  }

  getCuentaErrorMessage() {
    const cciControl = this.fg.get('cci')

    if (cciControl?.hasError('required')) {
      return this.transloco.translate('errors.cuentaObligatoria')
    } else if (cciControl?.hasError('pattern')) {
      const idTipo = this.fg.get('idTipoPro')?.value
      return idTipo === 1
        ? this.transloco.translate('errors.cuentaSoloNumeros')
        : this.transloco.translate('errors.cuentaAlfanumerica')
    } else if (cciControl?.hasError('maxlength')) {
      return this.transloco.translate('errors.cuentaMaxDigitos')
    }
    return ''
  }

  getMessageCuenta() {
    const swifControl = this.fg.get('swif')
    const abaControl = this.fg.get('aba')
    const ibanControl = this.fg.get('iban')

    if (swifControl?.hasError('maxlength')) {
      return this.transloco.translate('errors.cuentaMax23Digitos')
    }
    if (abaControl?.hasError('maxlength')) {
      return this.transloco.translate('errors.cuentaMax23Digitos')
    }
    if (ibanControl?.hasError('maxlength')) {
      return this.transloco.translate('errors.cuentaMax23Digitos')
    }
    return ''
  }
}

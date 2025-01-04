import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton, MatButtonModule } from '@angular/material/button'
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { RouterModule } from '@angular/router'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { DialogRef } from '@angular/cdk/dialog'
import { ContactoService } from '@fuse/services/providers/contacto.service'
import { MatIcon } from '@angular/material/icon'
import { MatTabsModule } from '@angular/material/tabs'
import { MatSelectModule } from '@angular/material/select'
import { MatRadioModule } from '@angular/material/radio'
import { MatSliderModule } from '@angular/material/slider'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { CombosService } from '../../../services/combos.service'
import { MatDialogRef } from '@angular/material/dialog'
import { NgxMaskDirective } from 'ngx-mask'
import { TranslocoModule } from '@ngneat/transloco'
import { ProvidersService } from '@fuse/services/providers/providers.service'

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
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
export class NewContactComponent implements OnInit {
  fb = inject(FormBuilder)
  dRef = inject(DialogRef<NewContactComponent>)
  dialogRef = inject(MatDialogRef<NewContactComponent>)
  contactoSvc = inject(ContactoService)
  _comboSvc = inject(CombosService)
  providerSrv = inject(ProvidersService)
  fConfirm = inject(FuseConfirmationService)
  fgr = this.fb.group({
    id: [0],
    idProveedor: [0],
    idTipo: [1],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    cargo: ['', Validators.required],
    area: [''],
    telefono: ['', Validators.required],
    correo: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), Validators.required]],
    principal: [0],
  })
  flg_edit: boolean = false
  idprovee = ''
  ngOnInit(): void {
    this.listarTipoPersona()
    this.fgr.patchValue({
      idProveedor: this.dRef.config.data.idprovee,
    })
    if (this.dRef.config.data.item) {
      this.flg_edit = true
      this.fgr.patchValue(this.dRef.config.data.item)
    } else {
      this.flg_edit = false
    }
  }
  doRegister() {
    if (this.fgr.value.id == 0) {
      this.createContacto()
    } else {
      this.updateContacto()
    }
  }
  tipoPersona = []
  listarTipoPersona() {
    this._comboSvc.getListadoTipoPersona().subscribe((resp) => {
      this.tipoPersona = resp.data
    })
  }
  updateContacto() {
    this.contactoSvc.updatePersona(this.fgr.value).subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.dialogRef.close('SI')
      }
    })
  }
  createContacto() {
    this.contactoSvc.postPersona(this.fgr.value).subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.dialogRef.close('SI')
      }
    })
  }
}

import { DialogRef } from '@angular/cdk/dialog'
import { CommonModule, DOCUMENT } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
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
import { CatalogoService } from '@fuse/services/providers/catalogo.service'
import { TranslocoModule } from '@ngneat/transloco'
import { NgxMaskDirective } from 'ngx-mask'

@Component({
  selector: 'app-new-catalogo',
  templateUrl: './new-catalogo.component.html',
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
    TranslocoModule
  ],
})
export class NewCatalogoComponent implements OnInit {
  isLoading = signal(false)
  fb = inject(FormBuilder)
  dRef = inject(DialogRef<NewCatalogoComponent>)
  dialogRef = inject(MatDialogRef<NewCatalogoComponent>)
  catalogoSvc = inject(CatalogoService)
  fConfirm = inject(FuseConfirmationService)
  document = inject(DOCUMENT) as Document
  fgr = this.fb.group({
    id: [0],
    idProveedor: [0],
    nombre: ['', Validators.required],
    archivoBase64: ['', Validators.required],
  })
  flg_edit: boolean = false
  ngOnInit(): void {
    this.fgr.patchValue({
      idProveedor: this.dRef.config.data.idprovee,
    })
    if (this.dRef.config.data.item) {
      this.flg_edit = true
      this.fgr.patchValue(this.dRef.config.data.item)
      this.esActualizar = true
      this.configurarValidaciones()
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
  selectedFileName: string | null = null
  esActualizar: boolean = false;
  // Método para manejar la selección del archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement

    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        // El archivo se convierte a base64
        const base64String = reader.result as string
        this.fgr.patchValue({
          archivoBase64: base64String,
        })
        // this.sendFile(base64String); // Envía el archivo base64
      }

      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error)
      }

      reader.readAsDataURL(file) // Lee el archivo como un DataURL (base64)
      this.selectedFileName = file.name // Obtiene el nombre del archivo seleccionado
    } else {
      this.selectedFileName = null // Si no hay archivo seleccionado, resetea el nombre
    }
  }
  updateContacto() {
    this.isLoading.update(() => true)
    this.catalogoSvc.updateCatalogo(this.fgr.value).subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.isLoading.update(() => false)
        this.dialogRef.close('SI')
      }
    })
  }
  createContacto() {
    this.isLoading.update(() => true)
    this.catalogoSvc.postCatalogo(this.fgr.value).subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.isLoading.update(() => false)
        this.dialogRef.close('SI')
      }
    })
  }
  configurarValidaciones() {
    if (this.esActualizar) {
      // Si es actualización, quitamos la validación de 'required' en archivoBase64
      this.fgr.get('archivoBase64')?.clearValidators();
    } else {
      // Si es creación, mantenemos el 'required'
      this.fgr.get('archivoBase64')?.setValidators([Validators.required]);
    }

    // Asegúrate de actualizar el estado del control después de cambiar validaciones
    this.fgr.get('archivoBase64')?.updateValueAndValidity();
  }
}

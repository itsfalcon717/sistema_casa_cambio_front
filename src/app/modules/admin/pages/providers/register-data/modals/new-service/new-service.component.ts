import { DialogRef } from '@angular/cdk/dialog'
import { CommonModule, DOCUMENT } from '@angular/common'
import { Component, ElementRef, Inject, inject } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { RouterModule } from '@angular/router'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { CombosService } from '../../../services/combos.service'
import { MarcaService } from '@fuse/services/providers/marca.service'
import { MatDialogRef } from '@angular/material/dialog'
import { TranslocoModule } from '@ngneat/transloco'
import { MatSelectModule } from '@angular/material/select'

@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  // styles: [':host{display:contents}'], // Makes component host as if it was not there, can offer less css headaches. Use @HostBinding class approach for easier overrides.
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterModule,
    TranslocoModule,
    MatSelectModule
  ],
})
export class NewServiceComponent {
  fb = inject(FormBuilder)
  _comboSvc = inject(CombosService)
  marcaSvc = inject(MarcaService)
  dRef = inject(DialogRef<NewServiceComponent>)
  dialogRef = inject(MatDialogRef<NewServiceComponent>)
  fConfirm = inject(FuseConfirmationService)

  fg = this.fb.group({
    id:[0],
    idProveedor: [0],
    nombre: ['',],
    productoServicio: ['', Validators.required],
    descripcion: ['', Validators.required],
  })
  flg_edit: boolean = false
  idprovee=""
  ngOnInit(): void {
    this.fg.patchValue({
        idProveedor:this.dRef.config.data.idprovee
    })
    if (this.dRef.config.data.item) {
      this.flg_edit = true
      this.fg.patchValue(this.dRef.config.data.item)
    } else {
      this.flg_edit = false
    }
  }
  doRegister() {
    if(this.fg.value.id==0){
        this.createMarca()
    }else{
        this.updateMarca()
    }
  }
  updateMarca() {
    this.marcaSvc.updateMarca(this.fg.value).subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.dialogRef.close("SI")
      }
    })
  }
  createMarca() {
    this.marcaSvc.postMarca(this.fg.value).subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.dialogRef.close("SI")
      }
    })
  }
}

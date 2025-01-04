import { DialogRef } from '@angular/cdk/dialog';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { AuthService } from 'app/core/auth/auth.service';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-cambio-contra',
  standalone: true,
  imports: [
    RouterLink,
    FuseAlertComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    LanguagesComponent,
    TranslocoModule,
  ],
  templateUrl: './new-cambio-contra.component.html',
})
export class NewCambioContraComponent {

    fb = inject(FormBuilder)
    dRef = inject(DialogRef<NewCambioContraComponent>)
    dialogRef = inject(MatDialogRef<NewCambioContraComponent>)
    fConfirm = inject(FuseConfirmationService)
    usuarioSvc = inject(AuthService)
    cdr = inject(ChangeDetectorRef)
    toastr = inject(ToastrService)
    transloco = inject(TranslocoService)
    fg = this.fb.group({
      id: [0],
      clave: ['', Validators.required],
      clave_confirmacion: ['', Validators.required],
    })

    category = []

    constructor() {}

    ngOnInit(): void {
        const storageData = JSON.parse(localStorage.getItem('userData'))

        this.fg.patchValue({
            id:storageData.idUsuario
        })
    }

    doRegister() {

        const minLength = 8;
        const numberCount = (this.fg.value.clave.match(/\d/g) || []).length;
        const specialCharCount = (this.fg.value.clave.match(/[\W_]/g) || []).length;
        const upperCaseCount = (this.fg.value.clave.match(/[A-Z]/g) || []).length;
        const lowerCaseCount = (this.fg.value.clave.match(/[a-z]/g) || []).length;

        if (this.fg.value.clave.length < minLength) {
            return this.toastr.error('Error', this.transloco.translate("toas.contra_8"))
        }
        if (numberCount < 2) {
            return this.toastr.error('Error', this.transloco.translate("toas.contra_2"))
        }
        if (specialCharCount < 1) {
            return this.toastr.error('Error', this.transloco.translate("toas.contra_1_ca_es"))
        }
        if (upperCaseCount < 1) {
            return this.toastr.error('Error', this.transloco.translate("toas.contra_1_may"))
        }
        if (lowerCaseCount < 1) {
            return this.toastr.error('Error', this.transloco.translate("toas.contra_1_min"))
        }
        if(this.fg.value.clave != this.fg.value.clave_confirmacion){
            return this.toastr.error('Error', this.transloco.translate("toas.contra_1_contra"))
        }
        this.usuarioSvc.changePass(this.fg.value).subscribe(resp=>{
            if(resp.statusCode == 200){
                this.cdr.detectChanges();
                this.dialogRef.close(resp);
            }
        })
    }
}

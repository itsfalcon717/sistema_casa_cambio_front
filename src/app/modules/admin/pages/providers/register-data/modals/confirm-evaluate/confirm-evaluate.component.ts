import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { ProvidersRequestsService } from '@fuse/services/providers'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-confirm-evaluate',
  templateUrl: './confirm-evaluate.component.html',
  // styles: [':host{display:contents}'], // Makes component host as if it was not there, can offer less css headaches. Use @HostBinding class approach for easier overrides.
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
  ],
})
export class ConfirmEvaluateComponent {
  value = ''
  dialogRef = inject(MatDialogRef)
  fb = inject(FormBuilder)
  toastrService = inject(ToastrService)
  providerService = inject(ProvidersService)
  transloco = inject(TranslocoService)
  _providersSvc = inject(ProvidersRequestsService)
  fg = this.fb.group({
    aceptaDJ: ['', [Validators.required]],
    aceptaAD: ['', [Validators.required]],
    aceptaDP: ['', [Validators.required]],
  })
  continue() {
    if (this.fg.get('aceptaDJ').value && this.fg.get('aceptaAD').value && this.fg.get('aceptaDP').value) {
      this._providersSvc
        .updateProviders({
          ...this.providerService.currentProvider,
          ...this.fg.getRawValue(),
        })
        .subscribe((resp) => {
          this.dialogRef.close()
        })
    } else {
      this.toastrService.info(this.transloco.translate('toast.incompleteEvaluate'))
    }
  }
}

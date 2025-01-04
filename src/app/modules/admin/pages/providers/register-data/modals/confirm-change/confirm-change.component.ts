import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { TranslocoModule } from '@ngneat/transloco'

@Component({
  selector: 'app-confirm-change',
  templateUrl: './confirm-change.component.html',
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
  ],
})
export class ConfirmChangeComponent {
  value = ''
  dialogRef = inject(MatDialogRef)

  continue() {
    //
    this.dialogRef.close({
        value: this.value
    })
  }
}

import { CommonModule, JsonPipe } from '@angular/common'
import { Component, Inject } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { TranslocoModule } from '@ngneat/transloco'

@Component({
  selector: 'app-select-file',
  templateUrl: './select-file.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    TranslocoModule,
    MatIconModule,
    JsonPipe,
  ],
})
export class SelectFileComponent {
  fg = this.fb.group({
    file: ['', [Validators.required]],
  })
  cFile: any = {}

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<SelectFileComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data
  ) {}

  async handleFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.cFile.archivoRes = input.files[0].name
      this.fg.get('file').setValue(this.cFile.archivoRes)
      await this.getBase64(input.files[0]).then((data) => {
        this.cFile.archivo64 = data
      })
    } else {
      this.cFile.archivoRes = null
    }
  }

  clearFile() {
    this.fg.reset()
    this.cFile = {}
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => {
        return reject(error)
      }
    })
  }

  doRegister() {
    this.dialogRef.close({
      ...this.cFile,
      type: this.data.type,
    })
  }
}

import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { TranslocoModule } from '@ngneat/transloco'

@Component({
  selector: 'app-validate-invoice',
  templateUrl: './validate-invoice.component.html',
  styles: `
  .file-select {
  position: relative;
  display: inline-block;
  }

  .file-select::before {
    border: 1px solid #7f9e1e;
    color: #fff;
    background: #7f9e1e;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    font-size: 14px;
    content: "Buscar factura";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  a{
      border-radius:5px;
      padding:3px;
      color:white;
  }
  .file-select input[type="file"] {
  opacity: 0;
  height: 40px;
  display: inline-block;
  }
`,
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class ValidateInvoiceComponent {
  file: any = {}

  clearFile(item: any) {
    item.archivoRes = null
    item.archivo64 = null
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

  async onFileSelectedRes(event: Event, item: any) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.file.archivoRes = input.files[0].name
      await this.getBase64(input.files[0]).then((data) => {
        this.file.archivo64 = data
        // this.saveItem(item)
      })
    } else {
      this.file.archivoRes = null
    }
  }
}

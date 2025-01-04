import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { TranslocoModule } from '@ngneat/transloco'
import { UserService } from 'app/core/user/user.service'
import { ValidateInvoiceComponent } from '../modals/validate-invoice/validate-invoice.component'

@Component({
  selector: 'app-do-invoice',
  templateUrl: './do-invoice.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslocoModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class DoInvoiceComponent {
  file: any = {}
  dataSource = new MatTableDataSource<any>([
    {
      socialreason: '',
      ruc: '0000000000',
      emisiondate: 'Description',
      reference: 5,
      currency: '',
      subtotal: '',
      igv: '',
      total: '',
    },
  ])
  displayedColumns = ['socialreason', 'ruc', 'emisiondate', 'reference', 'currency', 'subtotal', 'igv', 'total']

  constructor(public readonly userService: UserService, private readonly matDialog: MatDialog) {}

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
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

  openSelectFile() {
    this.matDialog.open(ValidateInvoiceComponent, {
      width: '500px',
    })
  }
}

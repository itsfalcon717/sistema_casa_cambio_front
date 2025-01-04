import { DialogRef } from '@angular/cdk/dialog'
import { AsyncPipe, CommonModule } from '@angular/common'
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { TranslocoModule } from '@ngneat/transloco'
import { CombosService } from 'app/modules/admin/pages/providers/services/combos.service'
import { InvoicesService } from '../../services/invoices.service'

@Component({
  selector: 'app-detail-em',
  templateUrl: './detail-em.component.html',
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
    MatSelectModule,
    AsyncPipe,
    TranslocoModule,
    MatTableModule,
  ],
})
export class DetailEmComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator

  matDialog = inject(MatDialog)
  matDialogData = inject(MAT_DIALOG_DATA)
  dialogRef = inject(MatDialogRef)

  dataSource = new MatTableDataSource<any>([])

  displayedColumns: string[] = [
    'kardex',
    'id_AmarreOC',
    'codigoProducto',
    'nombreProducto',
    'cantidadOC',
    'cantidadGuia',
    // 'opSolicitudCompra',
    'observacionGuia',
  ]
  fb = inject(FormBuilder)
  combos$ = inject(InvoicesService)
  fg = this.fb.group({
    amarre: ['', [Validators.required]],
  })
  combos = []

  ngOnInit(): void {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }
}

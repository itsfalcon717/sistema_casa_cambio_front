import { DialogRef } from '@angular/cdk/dialog'
import { AsyncPipe, CommonModule } from '@angular/common'
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { TranslocoModule } from '@ngneat/transloco'
import { CombosService } from 'app/modules/admin/pages/providers/services/combos.service'
import { MigohesService } from '../../services/migohes.service'

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
  combos$ = inject(MigohesService)
  fg = this.fb.group({
    rucProveedor: [''],
    nombreProveedor: [''],
    nroGuiaProveedor: [''],
    fecha: [''],
    estado: [this.matDialogData.data.estadoGuia],
  })
  combos = []
  ngOnInit(): void {
    const {
      company,
      data: { opGuiaCompra },
    } = this.matDialogData
    this.combos$
      .obtenerGuiaCompra({
        idEmpresa: company,
        op: opGuiaCompra,
      })
      .subscribe((response: any) => {
        this.fg.patchValue(response.body)
        this.dataSource.data = response.body.detalle.map((e: any) => {
          return {
            ...e,
            cantidadPendiente: e.cantidadOC - e.cantidadGuia,
          }
        })
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }
}

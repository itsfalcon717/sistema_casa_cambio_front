import { AsyncPipe, CommonModule } from '@angular/common'
import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { TranslocoModule } from '@ngneat/transloco'

@Component({
  selector: 'app-details-order-purchase',
  templateUrl: './details-order-purchase.component.html',
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
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    TranslocoModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class DetailsOrderPurchaseComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  fb = inject(FormBuilder)
  displayedColumns: string[] = ['item', 'codigo', 'id_UnidadInv', 'cantidad', 'precio', 'importe', 'observaciones']
  dataSource = new MatTableDataSource<any>([])
  filterValue: string = ''
  tipoMoneda: string = ''
  fg = this.fb.group({
    ruc: [''],
    estado: [null],
    solped: [null],
    version: [null],
    mumRegistro: [''],
    rucProveedor: [''],
    fPublicacion: [''],
    rzSocial: [''],
    fOrden: [''],
    pago: [''],
    fEntrega: [''],
    cPago: [''],
    fVigencia: [''],
    nRecepcion: [''],
    subTotal: ['', [Validators.pattern('^[0-9]*[.,]?[0-9]+$')]],
    inpuesto: ['', [Validators.pattern('^[0-9]*[.,]?[0-9]+$')]],
    observacion: [''],
    totalIGV: ['', [Validators.pattern('^[0-9]*[.,]?[0-9]+$')]],
  })
  combos = []
  constructor(
    public dialogRef: MatDialogRef<DetailsOrderPurchaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.addForm(this.data)
    this.combos = this.data.listEstado
    this.fg.disable()
  }

  // Método para agregar comas como separadores de miles y ajustar a 4 decimales
  formatNumber(value: number): string {
    if (value === null || value === undefined) return '';
    const valueWithDecimals = value.toFixed(4);
    let [integer, decimal] = valueWithDecimals.split('.');
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${integer}.${decimal}`
  }

  addForm(data) {
    if (data != undefined && data != null) {
      let IGV = data.data.total * 0.18
      this.fg.patchValue({
        estado: data.data.estado == 'Aprobado' ? 1 : 0,
        solped: data.data.op_OrdenCompra,
        mumRegistro: data.data.noregistro,
        version: null,
        rucProveedor: data.data.id_Agenda,
        fPublicacion: data.data.fechaOrden,
        rzSocial: data.data.razonSocial,
        fOrden: data.data.fechaOrden,
        pago: data.id_pago == 1?'Contado':'Crédito',
        fEntrega: data.data.fechaEntrega,
        cPago: data.data.modoPago,
        fVigencia: data.data.fechaVigencia,
        nRecepcion: data.data.notasRecepcion,
        subTotal: this.formatNumber(Number(data.data.subTotal)),
        inpuesto: this.formatNumber(Number(data.data.impuestos)),
        observacion: data.data.observaciones,
        totalIGV: this.formatNumber(Number(data.data.total + IGV)),
      })
      this.tipoMoneda = data.data.id_Moneda === 0 ? 'USD' : 'PEN'
    }

    const _data = data.data.detalle.map((e, index) => ({
      item: index + 1,
      codigo: e.codigo,
      id_UnidadInv: e.id_UnidadInv,
      cantidad: e.cantidad,
      precio: this.formatNumber(e.precio),
      importe: this.formatNumber(e.importe),
      observaciones: e.observaciones,
    }))
    this.dataSource.data = _data
  }
  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase()
  }
  closeModal(): void {
    this.dialogRef.close()
  }

}

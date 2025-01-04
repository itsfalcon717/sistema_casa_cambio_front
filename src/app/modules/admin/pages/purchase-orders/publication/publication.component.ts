import { CommonModule, DatePipe } from '@angular/common'
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { TranslocoModule } from '@ngneat/transloco'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { PurchaseOrdersService } from '@fuse/services/purchase-orders/purchase-orders.service'
import { DetailsOrderPurchaseComponent } from './modals/details-order-purchase/details-order-purchase.component'
import { addMonths, addYears } from 'date-fns'
import { SendPOComponent } from './modals/sendPO/sendPO.component'
import { CombosService } from '../../providers/services/combos.service'
import { catchError, of, tap } from 'rxjs'
import { FuseAlertType } from '@fuse/components/alert'
import { ToastrService } from 'ngx-toastr'
import { OnlyNumbersDirective } from 'assets/only-number'

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule,
    TranslocoModule,
    MatDatepickerModule,
    MatNativeDateModule,
    OnlyNumbersDirective,
  ],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent implements OnInit, AfterViewInit {
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  }
  @ViewChild(MatPaginator) paginator: MatPaginator
  //isAdmin: boolean = true
  matDialog = inject(MatDialog);
  requests = inject(PurchaseOrdersService);
  _comboSvc = inject(CombosService);
  dataSource = new MatTableDataSource<any>([]);
  dataSourceModal = new MatTableDataSource<any>([]);
  datePipe = inject(DatePipe);
  maxFechaFin: Date | null = null;
  toastr = inject(ToastrService);
  filterValue: string = '';
  userData = JSON.parse(localStorage.getItem('userData') || '{}');
  isAdmin = this.userData.idPerfil == '1' ? true : false;
  displayedColumns: string[] = ([] = this.isAdmin
    ? [
        'op_OrdenCompra',
        'idSociedad',
        'opSolicitudCompra',
        'nombreProveedor',
        'id_Agenda',
        'fechaEntrega',
        'fechaOrden',
        'id_Moneda',
        'total',
        'estado',
        'actions',
      ]
    : [
        'op_OrdenCompra',
        'idSociedad',
        'opSolicitudCompra',
        'nombreProveedor',
        'fechaEntrega',
        'fechaOrden',
        'id_Moneda',
        'total',
        'estado',
        'actions',
      ])
  filtering = false

  fb = inject(FormBuilder)
  listStatus = []
  listTypeOC = []
  fg = this.fb.group({
    idEmpresa: [null, [Validators.required]],
    estado: [null, [Validators.required]],
    tipoOC: [null, [Validators.required]],
    nroOrdenCompra: [''],
    ruc: ['', [Validators.pattern(/^\d{11}$/)]],
    nombreEmpresa: [''],
    nroSolicitudCompra: [null],
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
  })

  ngOnInit() {
    this.updateFechaFinLimit();
    this.getListadoEmpresa();
    this.getStatus();
    this.getTypeOC();
    this.getData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  clearFilter() {
    this.fg.reset({
      idEmpresa: null,
      estado: null,
      tipoOC: null,
      nroOrdenCompra: '',
      ruc: '',
      nombreEmpresa: '',
      nroSolicitudCompra: null,
      fechaInicial: '',
      fechaFinal: '',
    })
  }
  clearFilters() {
    this.clearFilter();
    this.dataSource.data = [];
    if (this.fg.valid) {
      this.getData().subscribe(() => {
        this.filtering = false;
      })
    }
    this.filtering = false;
  }
  sendData() {
    return {
      idEmpresa: Number(this.fg.get('idEmpresa')?.value), // Obtener valor de idEmpresa
      estado: this.fg.get('estado')?.value,
      tipoOC: this.fg.get('tipoOC')?.value,
      nroOrdenCompra: this.fg.get('nroOrdenCompra')?.value,
      ruc: this.isAdmin ? this.fg.get('ruc')?.value : this.userData.ruc,
      nombreEmpresa: this.fg.get('nombreEmpresa')?.value,
      nroSolicitudCompra: Number(this.fg.get('nroSolicitudCompra')?.value),
      fechaInicial: this.datePipe.transform(this.fg.get('fechaInicial')?.value, 'dd/MM/yyyy') || '',
      fechaFinal: this.datePipe.transform(this.fg.get('fechaFinal')?.value, 'dd/MM/yyyy') || '',
    }
  }

  getData() {
    if (this.fg.valid) {
      return this.requests.getOrders(this.sendData()).pipe(
        tap((response: any) => {
          if (response.code === 200) {
            if (response.data.length > 0) {
              this.dataSourceModal.data = response.data
              const _data = response.data.map((e) => ({
                op_OrdenCompra: e.noregistro,
                idSociedad:this.fg.get('idEmpresa')?.value == 1?'Silvestre'
                : this.fg.get('idEmpresa')?.value ==2 ? 'Neoagrum'
                : this.fg.get('idEmpresa')?.value ==5? 'Clenvi': 'Itagro',
                opSolicitudCompra: e.op_OrdenCompra,
                nombreProveedor: e.razonSocial, // pendiente de enviar desde el backend
                id_Agenda: e.id_Agenda,
                fechaEntrega: e.fechaEntrega,
                fechaOrden: e.fechaOrden,
                id_Moneda: e.id_Moneda === 0 ? 'USD' : 'PEN',
                total: this.formatNumber(e.total),
                estado: e.estado,
              }))
              this.dataSource.data = _data;
            } else {
              this.toastr.success(response.code, 'No hay data');
              this.dataSource.data = [];
            }
          } else {
            this.toastr.error(response.code, response.message);
            this.dataSource.data = [];
          }
        }),
        catchError((error) => {
          this.alert = {
            type: 'error',
            message: 'Ocurrió un error al cargar las órdenes. ' + error,
          }
          return of([])
        })
      )
    }
  }
  get rucControl() {
    return this.fg.get('ruc')
  }
  empresa = []
  getListadoEmpresa() {
    this._comboSvc.listarEmpresa().subscribe((resp) => {
      this.empresa = resp.data;
    })
  }

  getStatus() {
    this.requests.getStatus().subscribe((data) => {
      this.listStatus = data;
    })
  }
  getTypeOC() {
    this.requests.getTypeOC().subscribe((data) => {
      this.listTypeOC = data;
    })
  }
  openPurchaseOrderDetail(id: number) {
    let dato = this.dataSourceModal.data.filter((x) => x.noregistro == id)
    this.matDialog.open(DetailsOrderPurchaseComponent, {
      data: {
        data: dato[0],
        listEstado: this.listStatus,
      },
      width: '1200px',
      autoFocus: true, 
    })
  }

  updateFechaFinLimit() {
    this.fg.get('ruc')?.valueChanges.subscribe((ruc) => {
      this.adjustFechaFinLimit(ruc)
    })
    this.fg.get('fechaInicial')?.valueChanges.subscribe((fechaInicio) => {
      const ruc = this.fg.get('ruc')?.value
      this.adjustFechaFinLimit(ruc, fechaInicio);
    });
    this.fg.get('fechaFinal')?.valueChanges.subscribe((fechaFin) => {
      const fechaInicio = this.fg.get('fechaInicial')?.value
      if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
        this.fg.get('fechaFinal')?.setErrors({ fechaFinInvalida: true })
      }
    })
  }
  changeRuc() {
    this.adjustFechaFinLimit(this.fg.get('ruc')?.value, this.fg.get('fechaInicial')?.value)
  }
  adjustFechaFinLimit(ruc: string | null, fechaInicio?: string) {
   if (!fechaInicio) {
    fechaInicio = this.fg.get('fechaInicial')?.value;
  }

  if (fechaInicio) {
    const fechaInicioDate = new Date(fechaInicio);
    let fechaMax: Date;

    // Si hay RUC, el límite es de 4 años
    if (ruc) {
      fechaMax = addYears(fechaInicioDate, 4);
    } else {
      fechaMax = addMonths(fechaInicioDate, 3);
    }
    this.maxFechaFin = fechaMax;
    this.fg.get('fechaFinal')?.valueChanges.subscribe((fechaFin) => {
      if (fechaFin) {
        const fechaFinDate = new Date(fechaFin);
        if (fechaFinDate > fechaMax && this.fg.get('ruc')?.value == '') {
          this.toastr.error('Error', 'Ingresa RUC la fecha maxima es mayor a 3 meses.');
          this.fg.get('fechaFinal')?.setErrors({ fechaFinInvalida: true });
        } else {
          this.fg.get('fechaFinal')?.setErrors(null);
        }
      }
    });
    this.fg.get('fechaFinal')?.updateValueAndValidity();
  }
  }

  doFilter() {
    this.filtering = true
    if (this.fg.valid) {
      this.getData().subscribe()
    }
  }

  sendEmail(id) {
    this.matDialog.open(SendPOComponent, {
      data: { id: id },
      width: '400px',
    })
  }

  formatNumber(value: number): string {
    if (value === null || value === undefined) return '';
    const valueWithDecimals = value.toFixed(4);
    let [integer, decimal] = valueWithDecimals.split('.');
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${integer}.${decimal}`
  }

  applyFilter(): void {
    const filterValueLower = this.filterValue.trim().toLowerCase()
    this.dataSource.data = this.dataSource.data.filter((element) => {
      return Object.values(element).some((val) => val.toString().toLowerCase().includes(filterValueLower))
    })
  }
}

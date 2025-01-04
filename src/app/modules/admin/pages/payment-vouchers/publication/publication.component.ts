import { CommonModule, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, ViewChild, OnInit, AfterViewInit } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { TranslocoModule } from '@ngneat/transloco'
import { CombosService } from '../../providers/services/combos.service'
import { addMonths, addYears } from 'date-fns'
import { PaymentVouchersService } from '@fuse/services/payment-vouchers/payment-vouchers.service'
import { catchError, of, tap } from 'rxjs'
import { FuseAlertType } from '@fuse/components/alert'
import { ToastrService } from 'ngx-toastr'
import { IResponseFiltro } from '../Interfaces/IResponseFiltro'
import { IDocumentoData } from '../Interfaces/IDocumentoData'
import { Globals } from '../Globals/global'
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
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule,
    TranslocoModule,
    MatDatepickerModule,
    MatNativeDateModule,
    OnlyNumbersDirective
  ],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent implements OnInit, AfterViewInit {
  fb = inject(FormBuilder)
  isAdmin: boolean = true
  _comboSvc = inject(CombosService)
  _globals = inject(Globals)
  @ViewChild(MatPaginator) paginator: MatPaginator
  datePipe = inject(DatePipe)
  maxFechaFin: Date | null = null
  dataNotFilter = new MatTableDataSource<any>([])
  dataSource = new MatTableDataSource<any>([])
  requests = inject(PaymentVouchersService)
  toastr = inject(ToastrService)
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  }
  displayedColumns: string[] = []
  userData = JSON.parse(localStorage.getItem('userData') || '{}')

  filtering = false
  fg = this.fb.group({
    nroDocumento: [''],
    idEmpresa: [null, [Validators.required]],
    facturaPagada: [''],
    id_Agenda: ['', [Validators.pattern(/^\d{11}$/)]],
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    nombreProveedor: [''],
  })

  ngOnInit(): void {
    this.isAdmin = this.userData.idPerfil == '1' ? true : false
    this.initTable()

    this.updateFechaFinLimit()
    this.getListadoEmpresa()
    this.facturaPagada()
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  initTable() {
    if (this.isAdmin) {
      this.displayedColumns = [
        'id',
        'serie',
        'empresa',
        'proveedor',
        'tipoDocumento',
        'id_Moneda',
        'importe',
        'saldo',
        'id_Agenda',
        'fechaVencimiento',
        'fechaEstimadaPago',
        'documentoPagado',
        'fechaPago',
        'importePago',
        'detraccion',
        'detraccionImporte',
        'retencion',
        'retencionImporte',
        'banco',
        'importeFactoring',
      ]
    } else {
      this.displayedColumns = [
        'id',
        'serie',
        'empresa',
        'proveedor',
        'tipoDocumento',
        'id_Moneda',
        'importe',
        'saldo',
        'fechaVencimiento',
        'fechaEstimadaPago',
        'documentoPagado',
        'fechaPago',
        'importePago',
        'detraccion',
        'detraccionImporte',
        'retencion',
        'retencionImporte',
        'banco',
        'importeFactoring',
      ]
    }
    return this.displayedColumns
  }

  listFacturaPagada = []
  facturaPagada() {
    this.requests.facturaPagada().subscribe((data) => {
      this.listFacturaPagada = data
    })
  }
  empresa = []
  getListadoEmpresa() {
    this._comboSvc.listarEmpresa().subscribe((resp) => {
      this.empresa = resp.data
    })
  }
  sendData() {
    return {
      nroDocumento: this.fg.get('nroDocumento')?.value,
      idEmpresa: Number(this.fg.get('idEmpresa')?.value),
      facturaPagada: this.fg.get('facturaPagada')?.value,
      id_Agenda: this.isAdmin ? this.fg.get('id_Agenda')?.value : this.userData.ruc,
      fechaInicial: this.datePipe.transform(this.fg.get('fechaInicial')?.value, 'dd/MM/yyyy') || '',
      fechaFinal: this.datePipe.transform(this.fg.get('fechaFinal')?.value, 'dd/MM/yyyy') || '',
      nombreProveedor: this.fg.get('nombreProveedor')?.value,
    }
  }
  doFilter() {
    this.filtering = true
    if (this.fg.valid) {
      this.getData().subscribe()
    }
  }
  clearFilter() {
    this.fg.reset({
      nroDocumento: '',
      idEmpresa: null,
      facturaPagada: '',
      id_Agenda: '',
      fechaInicial: '',
      fechaFinal: '',
      nombreProveedor: '',
    })
  }
  clearFilters() {
    this.clearFilter()
    this.dataSource.data = []
    if (this.fg.valid) {
      this.getData().subscribe(() => {
        this.filtering = false
      })
    }
    this.filtering = false
  }
  // updateFechaFinLimit() {
  //   this.fg.get('fechaInicial')?.valueChanges.subscribe((fechaInicio) => {
  //     if (fechaInicio) {
  //       const fechaInicioDate = new Date(fechaInicio)
  //       this.maxFechaFin = addMonths(fechaInicioDate, 3)
  //       this.fg.get('fechaFinal')?.updateValueAndValidity()
  //     }
  //   })
  //   this.fg.get('fechaFinal')?.valueChanges.subscribe((fechaFin) => {
  //     const fechaInicio = this.fg.get('fechaInicial')?.value
  //     if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
  //       this.fg.get('fechaFinal')?.setErrors({ fechaFinInvalida: true })
  //     }
  //   })
  // }
  updateFechaFinLimit() {
    this.fg.get('id_Agenda')?.valueChanges.subscribe((ruc) => {
      this.adjustFechaFinLimit(ruc)
    })
    this.fg.get('fechaInicial')?.valueChanges.subscribe((fechaInicio) => {
      const ruc = this.fg.get('id_Agenda')?.value
      this.adjustFechaFinLimit(ruc, fechaInicio);
    });
    this.fg.get('fechaFinal')?.valueChanges.subscribe((fechaFin) => {
      const fechaInicio = this.fg.get('fechaInicial')?.value
      if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
        this.fg.get('fechaFinal')?.setErrors({ fechaFinInvalida: true })
      }
    })
  }
  getData() {
    if (this.fg.valid) {
      return this.requests.getFilter(this.sendData()).pipe(
        tap((response: any) => {
          if (response.code === 200) {
            if (response.data.length > 0) {
              this.dataNotFilter.data = response.data
              const _data = response.data.map((e) => ({
                id: e.serie,
                serie: e.serie + e.numero,
                empresa: e.empresa,
                proveedor: e.proveedor,
                tipoDocumento: e.tipoDocumento,
                id_Moneda: e.id_Moneda === 0 ? 'DOLARES' : 'SOLES',
                importe: e.importe,
                saldo: e.saldo,
                id_Agenda: e.id_Agenda,
                fechaVencimiento: e.fechaVencimiento,
                fechaEstimadaPago: e.fechaEstimadaPago,
                documentoPagado: e.documentoPagado,
                fechaPago: e.fechaPago,
                importePago: e.importePago,
                detraccion: e.detraccion,
                detraccionImporte: e.detraccionImporte,
                retencion: e.retencion,
                retencionImporte: e.retencionImporte,
                banco: e.banco,
                importeFactoring: e.importeFactoring,
              }))
              this.dataSource.data = _data
            } else {
              this.toastr.success(response.code, 'No hay data')
              this.dataSource.data = []
            }
          } else {
            this.toastr.error(response.code, response.message)
            this.dataSource.data = []
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

  dataRequest(data) {
    const filter: IDocumentoData = this.dataNotFilter.data.find((x) => x.serie === data)
    return {
      idEmpresa:
        filter.empresa.toLowerCase() == this._globals.sociedad.Silvestre.toLowerCase()
          ? 1
          : filter.empresa.toLowerCase() == this._globals.sociedad.Neoagrum.toLowerCase()
          ? 2
          : filter.empresa.toLowerCase() == this._globals.sociedad.Clenvi.toLowerCase()
          ? 5
          : 7,
          numero: filter.numero,//2154,//
          serie: filter.serie,//"E001",
          tipoDown:"",// '',
          RucProveedor:filter.id_Agenda,
      tipoDoc: this._globals.tipoDocumentoRetencion.retencionSUNAT,
    }
  }

  descargarArchivo(item) {
    this.requests.descargaArchivoRespuesta(this.dataRequest(item)).subscribe((resp) => {
      if (resp.code == 200) {
        const nombreArchivo = resp.data.nombre + '.zip'; // Añadimos la extensión .zip
        const archivoBase64 = resp.data.archivo64;
        const contentType = 'application/zip';
        let base64Data;
        if (archivoBase64.includes(',')) {
          base64Data = archivoBase64.split(',')[1];
        } else {
          base64Data = archivoBase64;
        }
        const blob = this.base64ToBlob(base64Data, contentType);
        const enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(blob);
        enlace.download = nombreArchivo; 
        enlace.click();
        URL.revokeObjectURL(enlace.href);
      } else {
        this.toastr.error(resp.code, resp.message);
      }
    });
  }
  
  base64ToBlob(base64Data, contentType) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
  

  changeRuc() {
    this.adjustFechaFinLimit(this.fg.get('id_Agenda')?.value, this.fg.get('fechaInicial')?.value)
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
         if (fechaFinDate > fechaMax && this.fg.get('id_Agenda')?.value == '') {
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
}

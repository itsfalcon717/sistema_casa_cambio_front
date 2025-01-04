import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponseFiltro } from 'app/modules/admin/pages/payment-vouchers/Interfaces/IResponseFiltro';
import { IPublicationRequest } from 'app/modules/admin/pages/payment-vouchers/Interfaces/IResquestFiltro';
import { IComboResponse } from 'app/modules/admin/pages/purchase-orders/Interfaces/IComboResponse';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { DocumentoRequest } from 'app/modules/admin/pages/payment-vouchers/Interfaces/IRequestDescarga';
import { DocumentoResponse } from 'app/modules/admin/pages/payment-vouchers/Interfaces/IResponseDescarga';
@Injectable({
  providedIn: 'root'
})
export class PaymentVouchersService {

 
  constructor(private http: HttpClient) {}
  facturaPagada(): Observable<IComboResponse[]> {
    return this.http.get<IComboResponse[]>("/assets/data/facturaPagada.json");
  }
  getFilter(filter: IPublicationRequest):Observable<IResponseFiltro>{
    return this.http.post<IResponseFiltro>(environment.paymentVouchers.list, filter).pipe();
   }
   descargaArchivoRespuesta(data: DocumentoRequest): Observable<any> {
    return this.http.post<DocumentoResponse>(environment.descargar.retenciones, data).pipe()
  }

}

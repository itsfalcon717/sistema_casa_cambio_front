import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IComboResponse } from 'app/modules/admin/pages/purchase-orders/Interfaces/IComboResponse';
import { IPublicationRequest } from 'app/modules/admin/pages/purchase-orders/Interfaces/IPublicationRequest';
import { IPublicationResponse } from 'app/modules/admin/pages/purchase-orders/Interfaces/IPublicationResponse';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PurchaseOrdersService {

  constructor(private http: HttpClient) {}

  getOrders(filter: IPublicationRequest):Observable<IPublicationResponse>{
   return this.http.post<IPublicationResponse>(environment.purchaseOrders.list, filter).pipe();
  }
  getStatus(): Observable<IComboResponse[]> {
    return this.http.get<IComboResponse[]>("/assets/data/estado.json");
  }
  getTypeOC(): Observable<IComboResponse[]> {
    return this.http.get<IComboResponse[]>("/assets/data/tipoOC.json");
  }
}
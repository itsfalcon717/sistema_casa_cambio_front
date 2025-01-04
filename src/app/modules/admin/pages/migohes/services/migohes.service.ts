import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'environments/environment'

@Injectable({
  providedIn: 'root',
})
export class MigohesService {
  constructor(private readonly _http: HttpClient) {}

  consultaGuiaCompra(body: any): Observable<any> {
    return this._http.post(environment.url + '/api/guia/erp/consultaGuiaCompra', body)
  }

  obtenerGuiaCompra(body: any): Observable<any> {
    return this._http.post(environment.url + '/api/guia/erp/obtenerGuiaCompra', body)
  }
}

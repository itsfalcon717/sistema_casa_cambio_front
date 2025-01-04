import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'environments/environment'

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  constructor(private readonly _http: HttpClient) {}

  consultaGuiaCompra(body: any): Observable<any> {
    return this._http.post(environment.url + '/api/guia/erp/consultaGuiaCompra', body)
  }

  obtenerGuiaCompra(body: any): Observable<any> {
    return this._http.post(environment.url + '/api/guia/erp/obtenerGuiaCompra', body)
  }

  obtenerPrefactura(body: any): Observable<any> {
    return this._http.post(environment.url + '/api/factura/obtenerPreFactura', body)
  }

  listarPreFactura(body: any): Observable<any> {
    return this._http.post(environment.url + '/api/factura/listarPreFactura', body)
  }

  cargarPreFactura(body: any): Observable<any> {
    return this._http.post(environment.url + '/api/factura/cargarPreFactura', body)
  }

  aprobarPreFactura(body: {
    idFactura: number
    estado: number
    observacion: string
    usuario: string
  }): Observable<any> {
    return this._http.post(environment.url + '/api/factura/aprobarPreFactura', body)
  }
}

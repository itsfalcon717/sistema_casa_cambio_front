import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  // MARCAS
  constructor(private _http: HttpClient) {}

  getListadoMarca(param: string): Observable<any> {
    return this._http.get<any>(environment.url + '/api/marca/listar/' + param)
  }
  postMarca(body: any): Observable<any> {
    return this._http.post<any>(environment.url + '/api/marca/crear/', body)
  }
  updateMarca(body: any): Observable<any> {
    return this._http.put<any>(environment.url + '/api/marca/actualizar/', body)
  }
  deleteMarca(param: string): Observable<any> {
    return this._http.delete<any>(environment.url + '/api/marca/delete/' + param)
  }
}

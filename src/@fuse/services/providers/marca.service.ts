import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  constructor(private _http: HttpClient) {}

  getListadoMarca(param: string): Observable<any> {
    return this._http.get<any>(environment.marca.list + '/' + param)
  }
  postMarca(body: any): Observable<any> {
    return this._http.post<any>(environment.marca.create, body)
  }
  updateMarca(body: any): Observable<any> {
    return this._http.put<any>(environment.marca.update, body)
  }
  deleteMarca(param: string): Observable<any> {
    return this._http.delete<any>(environment.marca.delete + '/' + param)
  }
}

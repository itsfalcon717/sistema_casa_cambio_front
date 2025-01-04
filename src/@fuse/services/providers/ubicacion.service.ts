import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UbicacionService {
  constructor(private _http: HttpClient) {}

  getListadoUbi(param: string): Observable<any> {
    return this._http.get<any>(environment.ubicacion.list + '/' + param)
  }
  postUbi(body: any): Observable<any> {
    return this._http.post<any>(environment.ubicacion.create, body)
  }
  updateUbi(body: any): Observable<any> {
    return this._http.put<any>(environment.ubicacion.update, body)
  }
  deleteUbi(param: string): Observable<any> {
    return this._http.delete<any>(environment.ubicacion.delete + '/' + param)
  }
}

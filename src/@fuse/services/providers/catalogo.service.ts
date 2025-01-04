import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  constructor(private _http: HttpClient) {}

  getListadoCatalogo(param: string): Observable<any> {
    return this._http.get<any>(environment.catalogo.list + '/' + param)
  }
  postCatalogo(body: any): Observable<any> {
    return this._http.post<any>(environment.catalogo.create, body)
  }
  updateCatalogo(body: any): Observable<any> {
    return this._http.put<any>(environment.catalogo.update, body)
  }
  deleteCatalogo(param: string): Observable<any> {
    return this._http.delete<any>(environment.catalogo.delete + '/' + param)
  }
  descargaArchivoRespuesta(id: any): Observable<any> {
    return this._http.get<any>(environment.descargar.catalogo+'/'+id).pipe()
  }
}

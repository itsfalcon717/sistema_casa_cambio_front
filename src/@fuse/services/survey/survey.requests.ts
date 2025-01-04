import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SurveyRequests {
  constructor(private readonly _http: HttpClient) {}

  getSurvey(body: any): Observable<any> {
    return this._http.post<any>(environment.url + '/api/encuesta/buscar', body).pipe()
  }

  sendRequest(body: any): Observable<any> {
    return this._http.post<any>(environment.url + '/api/encuesta/respuesta', body).pipe()
  }
  descargaArchivoRespuesta(id: any): Observable<any> {
    return this._http.get<any>(environment.descargar.respuesta+'/'+id).pipe()
  }
  descargaArchivoPregunta(id: any): Observable<any> {
    return this._http.get<any>(environment.descargar.pregunta+'/'+id).pipe()
  }

}

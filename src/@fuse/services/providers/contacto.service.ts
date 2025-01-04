import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
  constructor(private _http: HttpClient) {}

  getListadoPersona(param: string): Observable<any> {
    return this._http.get<any>( environment.contact.list +'/'+param);
  }
  postPersona(body: any): Observable<any> {
    return this._http.post<any>( environment.contact.create,body);
  }
  updatePersona(body: any): Observable<any> {
    return this._http.put<any>( environment.contact.update,body);
  }
  deletePersona(param: string): Observable<any> {
    return this._http.delete<any>( environment.contact.delete +'/'+ param);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CuentasService {
  constructor(private _http: HttpClient) {}

  getListadoCuenta(param:string):Observable<any>{
    return this._http.get<any>( environment.cuenta.list +'/'+param);
  }
  postCuenta(body:any):Observable<any>{
    return this._http.post<any>( environment.cuenta.create,body);
  }
  updateCuenta(body:any):Observable<any>{
    return this._http.put<any>( environment.cuenta.update,body);
  }
  deleteCuenta(param:string):Observable<any>{
    return this._http.delete<any>( environment.cuenta.delete +'/'+ param);
  }
}

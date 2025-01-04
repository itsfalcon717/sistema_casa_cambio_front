import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ResponseCombo } from '../models/combo'
import { environment } from 'environments/environment'

@Injectable({
  providedIn: 'root',
})
export class CombosService {
  constructor(private _http: HttpClient) {}

  getListadoPais(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarPaises')
  }
  getListadoRegiones(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarRegion')
  }
  getListadoProvincia(param: string): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarProvincia' + '/' + param)
  }
  getListadoDistrito(param: string): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarDistrito' + '/' + param)
  }
  getListadoGiroNegocio(id): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarGiroNegocio/'+id)
  }
  getListadoTipoPersona(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoPersona')
  }
  getListadoCatProv(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarCategoriaProveedor')
  }
  getListadoEstProv(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarEstadoProveedor')
  }
  getListadoTipoProv(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoProveedor')
  }
  getListadoRamaNego(id): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarRamaNegocio/'+id)
  }
  getListadoTipoClie(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoCliente')
  }
  getListadoTipoContri(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoContribuyente')
  }
  getListadoTipoCuenta(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoCuenta')
  }
  getListadoTipoDoc(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoDocumento')
  }
  getListadoTipoMone(id): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoMoneda/'+id)
  }
  getListadoTipoUbi(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoUbicacion')
  }
  getListadoOpeAfect(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarOperacionesAfectadas')
  }
  getListadoEntidadBan(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarEntidadBancaria')
  }
  getListadoComprobante(id): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoComprobante/'+id)
  }
  getListadoCondicionPago(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarCondicionPago')
  }
  listarTipoContribuyente(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoContribuyente')
  }

  listarTipoCalle(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoCalle')
  }
  listarTipoDireccion(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoDireccion')
  }
  listarTipoZona(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarTipoZona')
  }
  listarZona(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarZona')
  }
  listarEmpresa(): Observable<ResponseCombo> {
    return this._http.get<ResponseCombo>(environment.url + '/api/master/listarEmpresa')
  }
}

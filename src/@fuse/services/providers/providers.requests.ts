import { DOCUMENT } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { environment } from 'environments/environment'
import { filter, take } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ProvidersRequestsService {
  /**
   * Constructor
   */
  constructor(private readonly http: HttpClient) {}

  createProvider(body: any) {
    return this.http.post(environment.providers.create, body).pipe()
  }
  updateProvider(body: any) {
    return this.http.put(environment.providers.update, body).pipe()
  }
  listProviders(filter: any) {
    return this.http.post(environment.providers.list, filter).pipe()
  }
  listProvidersXid(id: any) {
    return this.http.get(environment.providers.byId + '/' + id).pipe()
  }
  updateProviders(body: any) {
    return this.http.put(environment.providers.update, body).pipe()
  }
  sendErp(id: any) {
    return this.http.get(environment.providers.erp + '/' + id).pipe()
  }
  sendSubsanacion(id: any) {
    return this.http.get(environment.providers.subsanacion + '/' + id).pipe()
  }
  finishHomologacion(body: any) {
    return this.http.post(environment.encuesta.finish, body).pipe()
  }
  validarHomologiacion(body: any) {
    return this.http.post(environment.encuesta.validar, body).pipe()
  }
  changeState(body: any) {
    return this.http.put(environment.providers.changeState, body).pipe()
  }
  sendToGaf(body: any) {
    return this.http.post(environment.providers.gaf, body).pipe()
  }
  listarProveedorEmpresa(body: any) {
    return this.http.post(environment.providers.listarProveedorEmpresa, body).pipe()
  }
  agregarProveedorEmpresa(body: { idProveedor: number; idEmpresa: number; accion: string }) {
    return this.http.post(environment.providers.agregarProveedorEmpresa, body).pipe()
  }
}

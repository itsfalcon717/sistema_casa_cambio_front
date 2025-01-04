import { DOCUMENT } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { environment } from 'environments/environment'
import { filter, take } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AuthRequestsService {
  /**
   * Constructor
   */
  constructor(private readonly http: HttpClient) {}

  login(body: any) {
    return this.http.post(environment.auth.login, body).pipe()
  }

  logout(filter: any) {
    return this.http.post(environment.auth.logout, filter).pipe()
  }

  forgotPassword(filter: any) {
    return this.http.post(environment.auth.forgot, filter).pipe()
  }
}

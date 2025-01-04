import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { User } from 'app/core/user/user.types'
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class UserService {
  private _httpClient = inject(HttpClient)
  private _user: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for user
   *
   * @param value
   */
  set user(value: any) {
    // Store the value
    this._user.next(value)
  }

  get currentUser() {
    return this._user.getValue()
  }

  get $user() {
    return {
      idPerfil: 2,
    }
  }

  get userToken() {
    return localStorage.getItem('token')
  }

  get isProvider() {
    return this.currentUser.idPerfil == 2
  }

  get isAdmin() {

    return this.currentUser.idPerfil == 1
  }

  get user$(): Observable<any> {
    return this._user.asObservable()
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the current signed-in user data
   */
  get(): Observable<any> {
    return this._httpClient.get<any>('api/common/user').pipe(
      tap((user) => {
        this._user.next(user)
      })
    )
  }

  /**
   * Update the user
   *
   * @param user
   */
  update(user: any): Observable<any> {
    return this._httpClient.patch<any>('api/common/user', { user }).pipe(
      map((response) => {
        this._user.next(response)
      })
    )
  }
}

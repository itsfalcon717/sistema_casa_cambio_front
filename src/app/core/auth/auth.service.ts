import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AuthUtils } from 'app/core/auth/auth.utils'
import { UserService } from 'app/core/user/user.service'
import { environment } from 'environments/environment'
import { jwtDecode } from 'jwt-decode'
import { BehaviorSubject, catchError, forkJoin, Observable, of, switchMap, tap, throwError } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated: boolean = false
  user = new BehaviorSubject(null)
  private _httpClient = inject(HttpClient)
  private _userService = inject(UserService)

  authResponse: any = null
  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem('accessToken', token)
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? ''
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(usuario: string,email: string): Observable<any> {
    return this._httpClient.post<any>(environment.auth.reset, {usuario:usuario,correo:email})
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return this._httpClient.post('api/auth/reset-password', password)
  }
  changeCambio = false
  menu:any
  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { username: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError('User is already logged in.')
    }
  
    return this._httpClient.post(environment.auth.login, credentials).pipe(
      // Manejo de la respuesta de la solicitud HTTP
      switchMap((response: any) => {
        // Extraer el token de la respuesta
        const token = response.token;
  
        if (token) {
          // Almacenar el token en localStorage
          localStorage.setItem('token', token);
  
          // Decodificar el token JWT
          const decoded: any = jwtDecode(token);
  
          // Almacenar la información del usuario y de configuración en localStorage
          localStorage.setItem('cambio', JSON.stringify(decoded.cambio));
          localStorage.setItem('menus', decoded.menus);
  
          // Configurar la respuesta de autenticación en la clase
          this.authResponse = decoded;
          this.changeCambio = decoded.cambio;
          this.menu = decoded.menus;
  
          // Establecer el estado de autenticación a true
          this._authenticated = true;
          const user = {
            ...response.data,
            ...this.authResponse,
          }
          this._userService.user = user
          localStorage.setItem('userData', JSON.stringify(user))
          // Retornar la respuesta de login, o cualquier valor adicional que necesites
          return of(response);  // Puedes devolver los datos o algún otro valor relevante
        }
  
        // Si no hay token en la respuesta, lanzar un error
        return throwError('Authentication failed. No token received.');
      }),
      catchError((error) => {
        // Capturar cualquier error y retornar un mensaje adecuado
        return throwError(error.message || 'An error occurred during authentication.');
      })
    );
  }

  transformMenuJson(menuJson: any): any {
    return menuJson.map(item => {
      // Transformar idPerfil en un array de números
      item.idPerfil = item.idPerfil.map(profile => profile.idPerfil);

      // Transformar idPerfil en submenús
      if (item.children && item.children.length > 0) {
        item.children = item.children.map(child => {
          child.idPerfil = child.idPerfil.map(profile => profile.idPerfil);
          return child;
        });
      }

      return item;
    });
  }
  /**
   * Sign in using the access token
   */
  signInUsingToken(): Observable<any> {
    // Sign in using the

    // return this._httpClient
    //   .post('api/auth/sign-in-with-token', {
    //     accessToken: this.accessToken,
    //   })
    //   .pipe(
    //     catchError(() =>
    //       // Return false
    //       of(false)
    //     ),
    //     switchMap((response: any) => {
    //       // Replace the access token with the new one if it's available on
    //       // the response object.
    //       //
    //       // This is an added optional step for better security. Once you sign
    //       // in using the token, you should generate a new one on the server
    //       // side and attach it to the response object. Then the following
    //       // piece of code can replace the token with the refreshed one.
    //       if (response.accessToken) {
    //         this.accessToken = response.accessToken
    //       }

    //       // Set the authenticated flag to true
    //       this._authenticated = true

    //       // Store the user on the user service
    //       this._userService.user = response.user

    //       // Return true
    //       return of(true)
    //     })
    //   )

    return of(true)
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.clear()

    // Set the authenticated flag to false
    this._authenticated = false

    // Return the observable
    return of(true)
  }

  /**
   * Sign up
   *
   * @param user
   */
  signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
    return this._httpClient.post('api/auth/sign-up', user)
  }
  getById(id: any): Observable<any> {
    const storageData = localStorage.getItem('userData')
    if (storageData) {
      this._userService.user = JSON.parse(storageData)
      return of(storageData)
    } else {
      return this._httpClient.get(environment.providers.byId + '/' + id).pipe(
        tap((response: any) => {
          const user = {
            ...response.data,
            ...this.authResponse,
          }
          this._userService.user = user
          localStorage.setItem('userData', JSON.stringify(user))
        })
      )
    }
  }

  /**
   * Unlock session
   *
   * @param credentials
   */
  unlockSession(credentials: { email: string; password: string }): Observable<any> {
    return this._httpClient.post('api/auth/unlock-session', credentials)
  }

  fill() {
    const userData = localStorage.getItem('userData')
    const token = localStorage.getItem('accessToken')
    const user = JSON.parse(userData)

    if (user) {
      this.getById(user.idProveedor).subscribe((response: any) => {
        this.accessToken = token == 'null' ? '' : token
        this._authenticated = !!this.accessToken
      })
    } else {
      this.accessToken = ''
      this._authenticated = !!this.accessToken
    }


    return userData
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true)
    }

    // Check the access token availability
    if (!this.accessToken) {
      return of(false)
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false)
    }

    // If the access token exists, and it didn't expire, sign in using it
    return this.signInUsingToken()
  }

  changePass(body:any):Observable<any>{
    return this._httpClient.post(environment.auth.changePass, body)
  }
}

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http'
import { inject } from '@angular/core'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { AuthService } from 'app/core/auth/auth.service'
import { AuthUtils } from 'app/core/auth/auth.utils'
import { environment } from 'environments/environment'
import { tap } from 'lodash'
import { catchError, map, Observable, throwError } from 'rxjs'
import { ToastrService } from 'ngx-toastr'
import { FuseUtilsService } from '@fuse/services/utils'

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService)
  const fConfirm = inject(FuseConfirmationService)
  const fuseUtils = inject(FuseUtilsService)
  const toastr = inject(ToastrService)

  // Clone the request object
  let newReq = req.clone()

  // Request
  //
  // If the access token didn't expire, add the Authorization header.
  // We won't add the Authorization header if the access token expired.
  // This will force the server to return a "401 Unauthorized" response
  // for the protected API routes which our response interceptor will
  // catch and delete the access token from the local storage while logging
  // the user out from the app.
  if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
    newReq = req.clone({
      headers: req.headers
        .set('Authorization', 'Bearer ' + authService.accessToken)
        .set('Idioma', localStorage.getItem('idioma')),
    })
  } else {
    newReq = req.clone({
      headers: req.headers.set('Idioma', localStorage.getItem('idioma')),
    })
  }

  const acceptedPaths = [
    environment.providers.create,
    environment.auth.login,
    environment.url + '/api/encuesta/respuesta',
    environment.cuenta.update,
    environment.cuenta.create,
    environment.contact.update,
    environment.contact.create,
    environment.catalogo.create,
    environment.catalogo.update,
    environment.marca.create,
    environment.marca.update,
    environment.url + '/api/marca/crear/',
    environment.url + '/api/marca/actualizar/',
    environment.providers.update,
    environment.encuesta.finish,
    environment.encuesta.validar,
    environment.providers.changeState,
    environment.providers.erp,
    environment.providers.subsanacion,
    environment.providers.gaf,
    environment.auth.changePass,
    environment.url,
  ]

  // Response
  return next(newReq).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        if (event.body.statusCode === HttpStatusCode.Ok && acceptedPaths.find((f) => f === newReq.url)) {
          toastr.success(event.body.message, event.body.data.message)
        }
      }
      return event
    }),
    catchError((error) => {
      if (error instanceof HttpErrorResponse && acceptedPaths.find((f) => f === newReq.url)) {
        toastr.error(error.error.message, 'Ocurrio un error')
      }
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.signOut()
        location.reload()
      }

      return throwError(error)
    })
  )
}

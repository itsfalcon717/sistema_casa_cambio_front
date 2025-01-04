import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http'
import { inject } from '@angular/core'
import { FuseLoadingService } from '@fuse/services/loading/loading.service'
import { environment } from 'environments/environment'
import { finalize, Observable, take } from 'rxjs'

export const fuseLoadingInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const fuseLoadingService = inject(FuseLoadingService)
  let handleRequestsAutomatically = false

  fuseLoadingService.auto$.pipe(take(1)).subscribe((value) => {
    handleRequestsAutomatically = value
  })

  if (!handleRequestsAutomatically) {
    return next(req)
  }

  const acceptedPaths = [
    environment.url + '/api/encuesta/respuesta',
  ]

  if (!acceptedPaths.find((f) => f === req.url)) {
    fuseLoadingService._setLoadingStatus(true, req.url)
  }

  return next(req).pipe(
    finalize(() => {
      fuseLoadingService._setLoadingStatus(false, req.url)
    })
  )
}

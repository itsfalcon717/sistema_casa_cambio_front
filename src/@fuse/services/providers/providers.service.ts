import { DOCUMENT } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { UserService } from 'app/core/user/user.service'
import { environment } from 'environments/environment'
import { BehaviorSubject, filter, take } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ProvidersService {
  _id: any
  private readonly _provider: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  $provider = this._provider.asObservable()

  set provider(value: any) {
    this._provider.next(value)
  }

  get currentProvider() {
    return this._provider?.getValue()
  }

  get isNational() {
    return this.currentProvider?.idTipo === 1
  }

  get verified() {
    return this.currentProvider?.homilogaciom
  }

  get id() {
    return this._id ?? this.userService.currentUser.id
  }

  set providerId(id: any) {
    this._id = id
  }

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
    private readonly activatedRouter: ActivatedRoute
  ) {}
}

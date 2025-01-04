import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, inject, signal } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatIcon } from '@angular/material/icon'
import { Router, RouterModule } from '@angular/router'
import { ProvidersRequestsService } from '@fuse/services/providers'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { TranslocoService } from '@ngneat/transloco'
import { AuthService } from 'app/core/auth/auth.service'
import { UserService } from 'app/core/user/user.service'
import { ToastrModule, ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckbox,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    RouterModule,
    ToastrModule,
  ],
})
export class RegisterComponent implements AfterViewInit {
  router = inject(Router)
  user = inject(UserService)
  auth = inject(AuthService)
  requests = inject(ProvidersRequestsService)
  provider = inject(ProvidersService)
  toastr = inject(ToastrService)
  transloco = inject(TranslocoService)
  fb = inject(FormBuilder)
  isLoading = signal(true)
  fg = this.fb.group({
    chek1: ['', [Validators.required]],
    chek2: ['', [Validators.required]],
  })

  ngAfterViewInit(): void {
    this.router.navigate(['/providers/company-data'])
    // this.requests.listProvidersXid(this.user.currentUser?.idProveedor).subscribe((response: any) => {
    //   this.provider.provider = response.data
    //   this.isLoading.update(() => false)

    //   if (response.data.aceptaEnvio && response.data.aceptaPolitias) {
    //     this.router.navigate(['/providers/company-data'])
    //   } else this.isLoading.update(() => false)
    // })
  }

  doCheck() {
    const userBody = {
      ...this.user.currentUser,
      aceptaEnvio: !!this.fg.get('chek1').value,
      aceptaPolitias: !!this.fg.get('chek2').value,
    }

    if (userBody.aceptaEnvio && userBody.aceptaPolitias) {
      this.requests.updateProvider(userBody).subscribe(() => {
        this.requests.listProvidersXid(userBody.idProveedor).subscribe((response: any) => {
          this.provider.provider = response.data
          localStorage.setItem('userData', JSON.stringify(response.data))
          //   this.auth.fill()
          this.router.navigate(['/providers/company-data'])
        })
      })
    } else {
      this.toastr.error(this.transloco.translate('toast.politica'), 'Ocurrio un error')
    }
  }
}

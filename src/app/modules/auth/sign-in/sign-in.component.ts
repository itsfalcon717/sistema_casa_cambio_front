import { NgIf } from '@angular/common'
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import {
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { fuseAnimations } from '@fuse/animations'
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert'
import { TranslocoModule } from '@ngneat/transloco'
import { AuthRequestsService } from 'app/core/auth/auth.requests'
import { AuthService } from 'app/core/auth/auth.service'
import { LanguagesComponent } from 'app/layout/common/languages/languages.component'
import { jwtDecode } from 'jwt-decode'

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
  styles: `
    .login-bg {
        background-image: url(https://media.istockphoto.com/id/1868056377/es/foto/dinero-en-la-mesa-de-casa-billetes-y-monedas-de-euro-sobre-una-mesa-frente-a-un-jard%C3%ADn-dentro.jpg?s=612x612&w=0&k=20&c=nmyWkGzLiPZ0CIL10z328DVsEDZ0qxT8g_v7yWLaHAI=);
        background-size: cover;
        background-position: center;
    }
    `,
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    RouterLink,
    FuseAlertComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    LanguagesComponent,
    TranslocoModule,
  ],
})
export class AuthSignInComponent implements OnInit {
  @ViewChild('signInNgForm') signInNgForm: NgForm

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  }
  signInForm: UntypedFormGroup
  showAlert: boolean = false

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private readonly _authRequests: AuthRequestsService,
    private _router: Router
  ) {}

  /**
   * On init
   */
  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    })
  }

  /**
   * Sign in
   */
  signIn(): void {
    // Return if the form is invalid

    if (this.signInForm.invalid) {
      return
    }

    // Disable the form
    // this.signInForm.disable()

    // Hide the alert
    this.showAlert = false

    // Sign in
    this._authService.signIn(this.signInForm.getRawValue()).subscribe(
      (response: any) => {
        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect'
        this._router.navigateByUrl(redirectURL)
      },
      (response) => {
        this.signInNgForm.resetForm()

        this.alert = {
          type: 'error',
          message: 'Credenciales incorrectas',
        }

        this.showAlert = true
      }
    )
  }
}

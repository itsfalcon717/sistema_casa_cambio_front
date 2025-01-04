import { DialogRef } from '@angular/cdk/dialog'
import { AsyncPipe, CommonModule, NgIf } from '@angular/common'
import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import {
  FormBuilder,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialog } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { Router, RouterLink, RouterModule } from '@angular/router'
import { fuseAnimations } from '@fuse/animations'
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { ProvidersRequestsService } from '@fuse/services/providers'
import { AuthService } from 'app/core/auth/auth.service'
import { NewProviderComponent } from 'app/modules/admin/pages/providers/evaluate/modals/new-provider/new-provider.component'
import { CombosService } from 'app/modules/admin/pages/providers/services/combos.service'
import { ToastrService } from 'ngx-toastr'
import { NewPoliticaComponent } from './components/new-politica/new-politica.component'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    FuseAlertComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterModule,
    MatSelectModule,
    AsyncPipe,
    TranslocoModule,
  ],
})
export class AuthSignUpComponent implements OnInit {
  @ViewChild('signUpNgForm') signUpNgForm: NgForm
  matDialog = inject(MatDialog)
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  }
  signUpForm: UntypedFormGroup
  showAlert: boolean = false

  fb = inject(FormBuilder)
  fConfirm = inject(FuseConfirmationService)
  requests = inject(ProvidersRequestsService)
  transloco = inject(TranslocoService)
  fg = this.fb.group({
    ruc: ['', Validators.required],
    correo: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), Validators.required]],
    nombres: ['', Validators.required],
    razonSocial: ['', Validators.required],
    apellidos: ['', Validators.required],
    idTipoProveedor: [1, Validators.required],
    categoria: [[], Validators.required],
    area: ['', Validators.required],
    aceptaEnvio: [''],
    aceptaPolitias: ['', Validators.required],
  })
  toastr = inject(ToastrService)
  category = []

  constructor(private readonly combosRequest: CombosService, private readonly _router: Router) {}

  tipoProv: any = []
  ngOnInit(): void {
    this.combosRequest.getListadoCatProv().subscribe((response) => {
      this.category = response.data
    })
    this.combosRequest.getListadoTipoProv().subscribe((resp) => {
      this.tipoProv = resp.data
    })
  }
  openModal(event) {
    if (event) {
      const _$ = this.matDialog.open(NewPoliticaComponent, {
        width: '40%',
      })
    }
  }
  doRegister() {
    const userBody = this.fg.getRawValue()
    if (userBody.aceptaPolitias) {
      this.requests
        .createProvider({
          ...this.fg.getRawValue(),
        })
        .subscribe(() => {
          this._router.navigateByUrl('/sign-in')
          this.showAlert = true
        })
    } else {
      this.toastr.error(this.transloco.translate('toast.politica'), 'Ocurrio un error')
    }
  }
}

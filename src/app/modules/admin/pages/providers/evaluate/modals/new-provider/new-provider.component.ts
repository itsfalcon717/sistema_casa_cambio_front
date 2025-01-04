import { DialogRef } from '@angular/cdk/dialog'
import { AsyncPipe, CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelect, MatSelectModule } from '@angular/material/select'
import { RouterModule } from '@angular/router'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { ProvidersRequestsService } from '@fuse/services/providers'
import { CombosService } from '../../../services/combos.service'

@Component({
  selector: 'app-new-provider',
  templateUrl: './new-provider.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterModule,
    MatSelectModule,
    AsyncPipe,
  ],
})
export class NewProviderComponent implements OnInit {
  fb = inject(FormBuilder)
  dRef = inject(DialogRef<NewProviderComponent>)
  fConfirm = inject(FuseConfirmationService)
  requests = inject(ProvidersRequestsService)

  fg = this.fb.group({
    ruc: ['', Validators.required],
    correo: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), Validators.required]],
    nombres: ['', Validators.required],
    razonSocial: ['', Validators.required],
    categoria:[[],Validators.required],
    apellidos: ['', Validators.required],
    area: ['', Validators.required],
    aceptaEnvio: [true, Validators.required],
    aceptaPolitias: [true, Validators.required],
  })

  category = []

  constructor(private readonly combosRequest: CombosService) {}

  ngOnInit(): void {
    this.combosRequest.getListadoCatProv().subscribe((response) => {
      this.category = response.data
    })
  }

  doRegister() {
    this.requests
      .createProvider({
        ...this.fg.getRawValue(),
      })
      .subscribe(() => {
        this.dRef.close()
      })
  }
}

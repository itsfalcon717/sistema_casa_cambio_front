import { DialogRef } from '@angular/cdk/dialog'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatDialogRef } from '@angular/material/dialog'
import { MatFormField } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSliderModule } from '@angular/material/slider'
import { MatTabsModule } from '@angular/material/tabs'
import { UbicacionService } from '@fuse/services/providers/ubicacion.service'
import { TranslocoModule } from '@ngneat/transloco'
import { NgxMaskDirective } from 'ngx-mask'
import { CombosService } from '../../../services/combos.service'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { ResponseCombo } from '../../../models/combo'

@Component({
  selector: 'app-new-ubicacion',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckbox,
    MatButton,
    MatIcon,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatSliderModule,
    MatSlideToggleModule,
    NgxMaskDirective,
    TranslocoModule,
  ],
  templateUrl: './new-ubicacion.component.html',
})
export class NewUbicacionComponent {
  fb = inject(FormBuilder)
  dRef = inject(DialogRef<NewUbicacionComponent>)
  dialogRef = inject(MatDialogRef<NewUbicacionComponent>)
  ubicacionSvc = inject(UbicacionService)
  _comboSvc = inject(CombosService)
  fConfirm = inject(FuseConfirmationService)
  fgr = this.fb.group({
    id: [0],
    idProveedor: [0],
    idTipo: [0, Validators.required],
    idRegion: [0, Validators.required],
    idProvincia: [0, Validators.required],
    idDistrito: [0, Validators.required],
    idPais: [0, Validators.required],
    idTipoCalle: [0, Validators.required],
    idTipoDireccion: [0, Validators.required],
    idTipoZona: [0],
    idZona: [0],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    numero: [''],
    zona: [''],
    departamento: [''],
  })
  flg_edit: boolean = false
  idprovee = ''
  ngOnInit(): void {
    this.listarTipoCalle()
    this.listarPais()
    this.listarTipo()
    this.listarTipoZona()
    this.listarTipoDireccion()
    this.cargarRegiones()
    this.fgr.patchValue({
      idProveedor: this.dRef.config.data.idprovee,
    })
    if (this.dRef.config.data.item) {
      this.flg_edit = true
      this.fgr.patchValue(this.dRef.config.data.item)
      this.cargarProvincias(this.dRef.config.data.item.idRegion)
      this.cargarDistritos(this.dRef.config.data.item.idProvincia)
    } else {
      this.flg_edit = false
    }
  }

  get fcCountry() {
    const country = this.fgr.get('idPais')
    return this.pais.find((f: any) => f.id === country.value)?.nombre
  }

  doRegister() {
    if (this.fgr.value.id == 0) {
      this.createUbicacion()
    } else {
      this.updateUbicacion()
    }
  }
  tipo = []
  pais = []
  tipoCalle = []
  tipoDirecion = []
  tipoZona = []

  listarTipoCalle() {
    this._comboSvc.listarTipoCalle().subscribe((resp) => {
      this.tipoCalle = resp.data
    })
  }
  listarPais() {
    this._comboSvc.getListadoPais().subscribe((resp) => {
      this.pais = resp.data
    })
  }
  listarTipo() {
    this._comboSvc.getListadoTipoUbi().subscribe((resp) => {
      this.tipo = resp.data
    })
  }
  listarTipoZona() {
    this._comboSvc.listarTipoZona().subscribe((resp) => {
      this.tipoZona = resp.data
    })
  }
  listarTipoDireccion() {
    this._comboSvc.listarTipoDireccion().subscribe((resp) => {
      this.tipoDirecion = resp.data
    })
  }
  cargarRegiones() {
    this._comboSvc.getListadoRegiones().subscribe(
      (response: ResponseCombo) => {
        if (response.statusCode === 200) {
          this.regiones = response.data // Suponiendo que 'data' contiene la lista de regiones
        } else {
          console.error(response.message)
        }
      },
      (error) => {
        console.error('Error al cargar las regiones:', error)
      }
    )
  }
  regiones = []
  distritos = []
  provincias = []
  cargarProvincias(idRegion: string) {
    this.distritos = []
    this.provincias = []
    this._comboSvc.getListadoProvincia(idRegion).subscribe(
      (response: ResponseCombo) => {
        if (response.statusCode === 200) {
          this.provincias = response.data
        } else {
          console.error(response.message)
        }
      },
      (error) => {
        console.error('Error al cargar las provincias:', error)
      }
    )
  }

  cargarDistritos(idProvincia: string) {
    // this.valueDistrito = ''
    this.distritos = []
    this._comboSvc.getListadoDistrito(idProvincia).subscribe(
      (response: ResponseCombo) => {
        if (response.statusCode === 200) {
          this.distritos = response.data
        } else {
          console.error(response.message)
        }
      },
      (error) => {
        console.error('Error al cargar los distritos:', error)
      }
    )
  }
  updateUbicacion() {
    const { idRegion, idProvincia, idDistrito, idPais, idTipoCalle, idTipoDireccion, idTipoZona, idZona, ...values } =
      this.fgr.value
    this.ubicacionSvc
      .updateUbi({
        idRegion: idRegion || null,
        idProvincia: idProvincia || null,
        idDistrito: idDistrito || null,
        idPais: idPais || null,
        idTipoCalle: idTipoCalle || null,
        idTipoDireccion: idTipoDireccion || null,
        idTipoZona: idTipoZona || null,
        idZona: idZona || null,
        ...values,
      })
      .subscribe((resp) => {
        if (resp.statusCode == 200) {
          this.dialogRef.close('SI')
        }
      })
  }
  createUbicacion() {
    const { idRegion, idProvincia, idDistrito, idPais, idTipoCalle, idTipoDireccion, idTipoZona, idZona, ...values } =
      this.fgr.value
    this.ubicacionSvc
      .postUbi({
        idRegion: idRegion || null,
        idProvincia: idProvincia || null,
        idDistrito: idDistrito || null,
        idPais: idPais || null,
        idTipoCalle: idTipoCalle || null,
        idTipoDireccion: idTipoDireccion || null,
        idTipoZona: idTipoZona || null,
        idZona: idZona || null,
        ...values,
      })
      .subscribe((resp) => {
        if (resp.statusCode == 200) {
          this.dialogRef.close('SI')
        }
      })
  }
}

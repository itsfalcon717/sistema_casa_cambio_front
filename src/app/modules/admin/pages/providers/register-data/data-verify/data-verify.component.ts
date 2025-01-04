import { CommonModule, JsonPipe, NgIf } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips'
import { MatIcon } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio'
import { MatTabsModule } from '@angular/material/tabs'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Router } from '@angular/router'
import { InputFileComponent } from '@fuse/components/input-file/input-file.component'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { ProvidersRequestsService } from '@fuse/services/providers'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { SurveyRequests } from '@fuse/services/survey/survey.requests'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'
import { UserService } from 'app/core/user/user.service'
import { forkJoin, mergeMap, of, tap } from 'rxjs'

@Component({
  selector: 'app-data-verify',
  templateUrl: './data-verify.component.html',
  styles: `

  .file-select {
  position: relative;
  display: inline-block;
}

.file-select::before {
  border: 1px solid #7f9e1e;
  color: #7f9e1e;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 12px;
  content: 'Seleccionar archivo'; /* testo por defecto */
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
a{
    border-radius:5px;
    padding:3px;
    color:white;
}
.file-select input[type="file"] {
  opacity: 0;
  width: 200px;
  height: 32px;
  display: inline-block;
}
  `,
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    MatCheckbox,
    MatButton,
    MatIcon,
    MatTabsModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatRadioModule,
    JsonPipe,
    InputFileComponent,
    MatTooltipModule,
    TranslocoModule,
    MatChipsModule,
  ],
})
export class DataVerifyComponent implements OnInit {
  user = inject(UserService)
  survey = inject(SurveyRequests)
  confirm = inject(FuseConfirmationService)
  requests = inject(ProvidersRequestsService)
  transloco = inject(TranslocoService)
  finalized = []
  questions = []
  surveys = []

  get currentUser() {
    return this.userService.currentUser
  }

  get currentProvider() {
    return this.providerService.currentProvider
  }

  needFile(id) {
    return [2, 4, 6, 7].find((f: any) => f === id)
  }

  withResponse(id) {
    return [3, 5, 6, 7].find((f: any) => f === id)
  }

  needCondition(id) {
    return [1, 5, 4, 7].find((f: any) => f === id)
  }

  constructor(
    private readonly userService: UserService,
    private readonly providerService: ProvidersService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.cdr.detectChanges()

    this.getData().subscribe(() => {
      this.cdr.detectChanges()
    })
  }
  readonly reactiveKeywords = signal([])

  removeReactiveKeyword(i, keyword: string) {
    i.respuesta = i.respuesta.filter((f) => f !== keyword)
  }

  addReactiveKeyword(i, event: MatChipInputEvent): void {
    const value = (event.value || '').trim()
    if (value) {
      i.respuesta.push(value)
    }
    event.chipInput!.clear()
  }

  getData() {
    this.surveys = []
    return this.survey
      .getSurvey({
        idEncuesta: 1,
        idProveedor: this.providerService.id,
      })
      .pipe(
        tap((response: any) => {
          this.surveys = response.data.reduce((acc: any, curr: any) => {
            const exists = acc.find((f: any) => f.bloque === curr.bloque)

            if (curr.idTipo === 8) {
              curr.respuesta = curr.respuesta ? curr.respuesta.split(',') : []
            }

            if (exists) {
              exists.questions.push(curr)
              return acc
            } else {
              return [
                ...acc,
                {
                  bloque: curr.bloque,
                  questions: [curr],
                },
              ]
            }
          }, [])
        })
      )
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => {
        return reject(error)
      }
    })
  }

  async onFileSelectedRes(event: Event, item: any) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      item.archivoRes = input.files[0].name
      await this.getBase64(input.files[0]).then((data) => {
        item.archivo64 = data
        // this.saveItem(item)
      })
    } else {
      item.archivoRes = null
    }
  }

  clearFile(item: any) {
    item.archivoRes = null
    item.archivo64 = null
  }

  descargarArchivo(item) {
    this.survey.descargaArchivoRespuesta(item.idRespuesta).subscribe((resp) => {
      if (resp.statusCode == 200) {
        const nombreArchivo = resp.data.nombre
        const archivoBase64 = resp.data.archivo64

        const contentType = archivoBase64.split(',')[0].split(':')[1].split(';')[0]

        const base64Data = archivoBase64.split(',')[1]

        const blob = this.base64ToBlob(base64Data, contentType)

        // Creamos un enlace de descarga
        const enlace = document.createElement('a')
        enlace.href = URL.createObjectURL(blob)
        enlace.download = nombreArchivo

        enlace.click()

        URL.revokeObjectURL(enlace.href)
      }
    })
  }
  descargaArchivoPregunta(item) {
    this.survey.descargaArchivoPregunta(item.id).subscribe((resp) => {
      if (resp.statusCode == 200) {
        const nombreArchivo = resp.data.nombre
        const archivoBase64 = resp.data.archivo64

        const contentType = archivoBase64.split(',')[0].split(':')[1].split(';')[0]

        const base64Data = archivoBase64.split(',')[1]

        const blob = this.base64ToBlob(base64Data, contentType)

        // Creamos un enlace de descarga
        const enlace = document.createElement('a')
        enlace.href = URL.createObjectURL(blob)
        enlace.download = nombreArchivo

        enlace.click()

        URL.revokeObjectURL(enlace.href)
      }
    })
  }

  base64ToBlob(base64Data, contentType) {
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: contentType })
  }

  saveItem(item: any) {
    this.cdr.detectChanges()
    item.loading = true
    let itemResponse = item.respuesta

    if (Array.isArray(item.respuesta)) {
      itemResponse = item.respuesta.toString()
    }

    this.survey
      .sendRequest({
        id: item.id,
        idProveedor: this.providerService.id,
        respuesta: itemResponse,
        condicion: item.condicion,
        archivo: item.archivoRes,
        archivo64: item.archivo64,
        verficacion: item.verficacion,
      })
      .subscribe(
        (response: any) => {
          item.idRespuesta = response.data[0].id
          item.sended = true
          item.loading = false
          this.cdr.detectChanges()
          this.requests.listProvidersXid(this.providerService.id).subscribe((response: any) => {
            this.providerService.provider = response.data
          })
        },
        () => {
          item.loading = false
          item.sended = false
          this.cdr.detectChanges()
        }
      )
  }

  save() {
    const errors = []
    const prepare = []

    this.surveys.forEach((survey: any) => {
      survey.questions.forEach((e) => {
        if (!e.idRespuesta) {
          const obj = {
            id: e.id,
            idProveedor: this.providerService.id,
            respuesta: null,
            condicion: null,
            archivo: null,
            archivo64: null,
          }

          switch (e.idTipo) {
            case 1:
              if (e.condicion === null) {
                e.error = true
                errors.push(e)
              } else {
                e.error = false

                obj.condicion = e.condicion
                prepare.push(obj)
              }
              break

            case 2:
              if (!e.archivo) {
                e.error = true
                errors.push(e)
              } else {
                e.error = false

                obj.archivo = e.archivo
                obj.archivo64 = e.archivo64
                prepare.push(obj)
              }
              break

            case 3:
              if (!e.respuesta) {
                e.error = true
                errors.push(e)
              } else {
                e.error = false

                obj.respuesta = e.respuesta
                prepare.push(obj)
              }
              break
          }
        }
      })
    })

    if (errors.length) {
      return
    }

    const dialogRef = this.confirm.open({
      title: this.transloco.translate('verif.grabar'), // Traducción del título
      actions: {
        confirm: {
          label: this.transloco.translate('eliminacion.confirmar'), // Traducción del botón Confirmar
        },
        cancel: {
          label: this.transloco.translate('eliminacion.cancelar'), // Traducción del botón Cancelar
        },
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.surveys = []
      const requests: any = []
      if (result) {
        prepare.forEach((e: any) => {
          requests.push(
            this.survey.sendRequest(e).pipe(
              tap((response: any) => {
                this.finalized.push({
                  id: e.id,
                  idRespuesta: response.data[0].id,
                })
              })
            )
          )
        })

        forkJoin(requests).subscribe(() => {
          this.getData().subscribe()
        })
      }
    })
  }

  validarEncuesta(item) {
    let req = {
      idRespuesta: item.idRespuesta,
      idUsuario: this.user.currentUser.id,
      valido: item.verficacionVal,
    }
    this.requests.validarHomologiacion(req).subscribe((resp: any) => {
      item.valido = true
      item.idRespuesta = resp.data.id
      this.cdr.detectChanges()
    })
  }

  finalizar() {
    const dialogRef = this.confirm.open({
      //   title: '¿Desea finalizar su homologación?',
      //   actions: {
      //     confirm: {
      //       label: 'Continuar',
      //     },
      //     cancel: {
      //       label: 'Cancelar',
      //     },
      //   },
      title: this.transloco.translate('verif.finish_homo'), // Traducción del título
      actions: {
        confirm: {
          label: this.transloco.translate('eliminacion.confirmar'), // Traducción del botón Confirmar
        },
        cancel: {
          label: this.transloco.translate('eliminacion.cancelar'), // Traducción del botón Cancelar
        },
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        let req = {
          idEncuesta: 1,
          idProveedor: this.providerService.id,
        }
        this.requests.finishHomologacion(req).subscribe((resp) => {
          this.router.navigate(['/providers/info']).then(() => {
            window.location.reload()
          })
        })
      }
    })
  }

  sendGaf() {
    const dialogRef = this.confirm.open({
      title: this.transloco.translate('eliminacion.confirm'), // Traducción del título
      actions: {
        confirm: {
          label: this.transloco.translate('eliminacion.confirmar'), // Traducción del botón Confirmar
        },
        cancel: {
          label: this.transloco.translate('eliminacion.cancelar'), // Traducción del botón Cancelar
        },
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        let req = {
          pregunta: [1, 3, 46],
          id: this.providerService.id,
        }
        this.requests.sendToGaf(req).subscribe()
      }
    })
  }
}

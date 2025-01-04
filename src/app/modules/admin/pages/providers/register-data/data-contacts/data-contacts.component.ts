import { DialogModule, DialogRef } from '@angular/cdk/dialog'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatDialog } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { NewContactComponent } from '../modals/new-contact/new-contact.component'
import { ContactoService } from '@fuse/services/providers/contacto.service'
import { MatPaginator } from '@angular/material/paginator'
import { ActivatedRoute } from '@angular/router'
import { UserService } from 'app/core/user/user.service'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'

@Component({
  selector: 'app-data-contacts',
  templateUrl: './data-contacts.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckbox,
    MatButton,
    MatIcon,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    DialogModule,
    MatPaginator,
    TranslocoModule,
  ],
})
export class DataContactsComponent implements OnInit {
  displayedColumns: string[] = ['names', 'role', 'phone', 'email', 'document', 'principal', 'actions']
  matDialog = inject(MatDialog)
  contactoSvc = inject(ContactoService)
  router = inject(ActivatedRoute)
  @ViewChild(MatPaginator) paginator: MatPaginator
  dataSource = new MatTableDataSource<any>([])
  idProveedor = ''

  constructor(
    public readonly user: UserService,
    public readonly provider: ProvidersService,
    private readonly confirm: FuseConfirmationService,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.idProveedor = this.provider.id
    this.listContact(this.provider.id)
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  addModal() {
    const _$ = this.matDialog.open(NewContactComponent, {
      width: '500px',
      height: 'calc(100vh - 100px)',
      data: {
        idprovee: this.idProveedor,
      },
    })

    _$.afterClosed().subscribe((result) => {
      if (result) {
        this.listContact(this.idProveedor)
      }
    })
  }
  updateModal(item: any) {
    const _$ = this.matDialog.open(NewContactComponent, {
      width: '500px',
      height: 'calc(100vh - 100px)',
      data: {
        item: item,
        idProvee: this.idProveedor,
      },
    })

    _$.afterClosed().subscribe((result) => {
      if (result) {
        this.listContact(this.idProveedor)
      }
    })
  }
  listContact(id: string) {
    this.contactoSvc.getListadoPersona(id).subscribe((resp) => {
      if (resp.data.length > 0) {
        this.dataSource.data = resp.data
      } else {
        this.dataSource.data = []
      }
    })
  }

  deleteContact(params: string) {
    const dialogRef = this.confirm.open({
      title: this.transloco.translate('eliminacion.titulo'), // Traducción del título
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
        this.contactoSvc.deletePersona(params).subscribe((resp) => {
          if (resp.statusCode == 200) {
            this.listContact(this.idProveedor)
          }
        })
      }
    })
  }
}

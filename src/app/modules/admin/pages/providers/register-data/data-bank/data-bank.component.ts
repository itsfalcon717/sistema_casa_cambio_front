import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatIcon } from '@angular/material/icon'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { NewBankComponent } from '../modals/new-bank/new-bank.component'
import { MatDialog } from '@angular/material/dialog'
import { CuentasService } from '@fuse/services/providers/cuentas.service'
import { MatPaginator } from '@angular/material/paginator'
import { DialogModule } from '@angular/cdk/dialog'
import { ActivatedRoute } from '@angular/router'
import { UserService } from 'app/core/user/user.service'
import { ProvidersService } from '@fuse/services/providers/providers.service'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'

@Component({
  selector: 'app-data-bank',
  templateUrl: './data-bank.component.html',
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
export class DataBankComponent implements OnInit {
  matDialog = inject(MatDialog)
  cuentaSvc = inject(CuentasService)
  router = inject(ActivatedRoute)
  @ViewChild(MatPaginator) paginator: MatPaginator
  dataSource = new MatTableDataSource<any>([])
  displayedColumns: string[] = ['entity', 'type', 'moneda', 'nro', 'cci', 'actions']
  idProveedor = ''

  constructor(
    public readonly user: UserService,
    public readonly provider: ProvidersService,
    public readonly confirm: FuseConfirmationService,
    private transloco:TranslocoService
  ) {}

  addModal() {
    const _$ = this.matDialog.open(NewBankComponent, {
      width: '500px',
      height:'calc(100vh - 100px)',
      data: {
        idprovee: this.idProveedor,
      },
    })

    _$.afterClosed().subscribe((result) => {
      if (result) {
        this.listCuenta(this.idProveedor)
      }
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  ngOnInit(): void {
    this.idProveedor = this.provider.id
    this.listCuenta(this.idProveedor)
  }
  updateModal(item: any) {
    const _$ = this.matDialog.open(NewBankComponent, {
      width: '500px',
      height:'calc(100vh - 100px)',
      data: {
        item: item,
        idProvee: this.idProveedor,
      },
    })

    _$.afterClosed().subscribe((result) => {
      if (result) {
        this.listCuenta(this.idProveedor)
      }
    })
  }
  listCuenta(id: string) {
    this.cuentaSvc.getListadoCuenta(id).subscribe((resp) => {
      if (resp.data?.length > 0) {
        this.dataSource.data = resp.data
      } else this.dataSource.data = []
    })
  }

  deleCecuenta(params: string) {
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
        this.cuentaSvc.deleteCuenta(params).subscribe((resp) => {
          if (resp.statusCode == 200) {
            this.listCuenta(this.idProveedor)
          }
        })
      }
    })
  }
}

import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { TranslocoModule } from '@ngneat/transloco'
import { DetailEmComponent } from '../modals/detail-em/detail-em.component'
import { MigohesStoreService } from '../services/migohes.store'

@Component({
  selector: 'app-table-provider',
  templateUrl: './table-provider.component.html',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatPaginatorModule, TranslocoModule],
  providers: [MigohesStoreService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableProviderComponent implements OnChanges {
  @Input() data: any[]
  @Input() company: string

  @ViewChild(MatPaginator) paginator: MatPaginator

  matDialog = inject(MatDialog)
  migoStore = inject(MigohesStoreService)

  dataSource = new MatTableDataSource<any>([])

  displayedColumns: string[] = [
    'numeroGuia',
    'opGuiaCompra',
    'opSolicitudCompra',
    'nombreProveedor',
    'fechaGuiaCompra',
    'estadoGuia',
    'actions',
  ]

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.data = this.data
    this.dataSource.paginator = this.paginator
  }

  openPurchaseOrderDetail(id: any, data: any) {
    this.matDialog.open(DetailEmComponent, {
      width: '900px',
      data: {
        data,
        company: +this.company,
      },
    })
  }
}

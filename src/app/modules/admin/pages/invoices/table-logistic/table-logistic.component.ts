import { CommonModule, JsonPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { TranslocoModule } from '@ngneat/transloco'
import { DetailEmComponent } from '../modals/detail-em/detail-em.component'
import { InvoicesService } from '../services/invoices.service'
import { InvoicesStoreService } from '../services/invoices.store'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-table-logistic',
  templateUrl: './table-logistic.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    TranslocoModule,
    JsonPipe,
    RouterModule
  ],
  providers: [InvoicesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLogisticComponent implements  OnChanges {
  @Input() data: any[]
  @Input() society: string
  @Input() columns: any[]

  @ViewChild(MatPaginator) paginator: MatPaginator

  matDialog = inject(MatDialog)
  migoStore = inject(InvoicesStoreService)

  dataSource = new MatTableDataSource<any>([])

  displayedColumns: string[];

  ngOnChanges(changes: SimpleChanges): void {
    this.displayedColumns = this.columns
    this.dataSource.data = this.data
    this.dataSource.paginator = this.paginator
  }

  openPurchaseOrderDetail(id: any, data: any) {
    this.matDialog.open(DetailEmComponent, {
      width: '900px',
      data: {
        data,
      },
    })
  }
}

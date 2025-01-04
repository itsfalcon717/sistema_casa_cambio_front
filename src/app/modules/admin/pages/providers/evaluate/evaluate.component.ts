import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { NewProviderComponent } from './modals/new-provider/new-provider.component'
import { ProvidersRequestsService } from '@fuse/services/providers'
import { tap } from 'rxjs'
import { CombosService } from '../services/combos.service'
import { TranslocoModule } from '@ngneat/transloco'

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  // styles: [':host{display:contents}'], // Makes component host as if it was not there, can offer less css headaches. Use @HostBinding class approach for easier overrides.
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule,
    TranslocoModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluateComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator

  matDialog = inject(MatDialog)
  requests = inject(ProvidersRequestsService)

  displayedColumns: string[] = ['code', 'ruc', 'socialreason', 'status', 'actions']
  // dataSource: WritableSignal<any[]> = signal([]);;
  fb = inject(FormBuilder)
  combos$ = inject(CombosService)
  fg = this.fb.group({
    ruc: [''],
    razonSocial: [''],
    idEstado: [null],
  })
  filtering = false
  dataSource = new MatTableDataSource<any>([])

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  combos = []
  ngOnInit(): void {
    this.combos$.getListadoEstProv().subscribe((response: any) => {
      this.combos = response.data
    })
    this.getData().subscribe()
  }

  doFilter() {
    this.filtering = true
    this.getData().subscribe()
  }

  clearFilters() {
    this.fg.reset()
    this.getData().subscribe(() => {
      this.filtering = false
    })
  }

  getData() {
    return this.requests.listProviders(this.fg.getRawValue()).pipe(
      tap((response: any) => {
        const _data = response.data.map((e) => ({
          id: e.id,
          code: e.id,
          ruc: e.ruc,
          socialreason: e.razonSocial,
          type: e.ramaNegocio,
          status: e.estado,
          actions: true,
        }))

        this.dataSource.data = _data
      })
    )
  }

  openNew() {
    const _$ = this.matDialog.open(NewProviderComponent, {
      width: '400px',
    })

    _$.afterClosed().subscribe(() => {
      this.getData().subscribe()
    })
  }
}

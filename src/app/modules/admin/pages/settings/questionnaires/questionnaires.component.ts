import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { NewQuestionnaireComponent } from './modals/new-questionnaire/new-questionnaire.component'

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  // styles: [':host{display:contents}'], // Makes component host as if it was not there, can offer less css headaches. Use @HostBinding class approach for easier overrides.
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule,
    MatDialogModule,
  ],
})
export class QuestionnairesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'created_by', 'created_at', 'actions']
  dataSource = []

  matDialog = inject(MatDialog)

  ngOnInit(): void {
    this.dataSource = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(() => ({
      id: '001',
      created_by: 'Jose de la torre',
      created_at: '25 ago 1999',
      status: true,
      actions: true,
    }))
  }

  openNew() {
    const _$ = this.matDialog.open(NewQuestionnaireComponent)
    _$.afterClosed().subscribe(() => {
      //
    })
  }
}

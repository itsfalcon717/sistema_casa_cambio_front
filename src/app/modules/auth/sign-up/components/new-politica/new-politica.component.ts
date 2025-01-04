import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';

@Component({
  selector: 'app-new-politica',
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
  ],
  templateUrl: './new-politica.component.html',
})
export class NewPoliticaComponent {
    dialogRef = inject(MatDialogRef<NewPoliticaComponent>)
    closeModal(){
        this.dialogRef.close()
    }
}

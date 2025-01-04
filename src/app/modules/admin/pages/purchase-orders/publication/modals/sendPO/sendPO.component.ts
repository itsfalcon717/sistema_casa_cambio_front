import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco'

@Component({
    selector: 'app-send-po',
    templateUrl: './sendPO.component.html',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatTableModule,
        MatDialogModule,
        TranslocoModule,
      ],
})
export class SendPOComponent implements OnInit{
    fb = inject(FormBuilder)
    dialogRef = inject(MatDialogRef<SendPOComponent>);
    fg = this.fb.group({
        correo: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), Validators.required]],
      })
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    } 

}

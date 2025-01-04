import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'app-data-catalog',
    templateUrl: './data-catalog.component.html',
    standalone: true,
    imports: [
        CommonModule,
        MatCheckbox,
        MatButton,
        MatIcon,
        MatTabsModule,
        ReactiveFormsModule,
        FormsModule,
    ],
})
export class DataCatalogComponent {}

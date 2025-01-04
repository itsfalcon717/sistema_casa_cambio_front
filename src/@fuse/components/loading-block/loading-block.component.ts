import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-loading-block',
  templateUrl: './loading-block.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, MatProgressBarModule, MatProgressSpinnerModule],
})
export class LoadingBlockComponent {}

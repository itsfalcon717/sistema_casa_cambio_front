import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'
import { CombosService } from '../providers/services/combos.service'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'migohes',
  templateUrl: './migohes.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, NgFor, NgClass, NgSwitch, NgSwitchCase, RouterModule],
  providers: [CombosService],
})
export class MigohesComponent {}

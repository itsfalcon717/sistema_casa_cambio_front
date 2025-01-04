import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SpanishPaginatorIntl } from './layout/common/languages/class/spanishPaginatorIntl/spanishPaginatorIntl'
import { MatPaginatorIntl } from '@angular/material/paginator'
import { LoadingBlockComponent } from '@fuse/components/loading-block/loading-block.component'
import { FuseUtilsService } from '@fuse/services/utils'
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, FuseLoadingBarComponent],
  providers: [
    // { provide: MatPaginatorIntl, useClass: SpanishPaginatorIntl }
  ],
})
export class AppComponent {
  fuseUtils = inject(FuseUtilsService)

  constructor() {}
}

import { NgIf } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router'
import { FuseFullscreenComponent } from '@fuse/components/fullscreen'
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar'
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation'
import { FuseMediaWatcherService } from '@fuse/services/media-watcher'
import { TranslocoService } from '@ngneat/transloco'
import { AuthService } from 'app/core/auth/auth.service'
import { NavigationService } from 'app/core/navigation/navigation.service'
import { Navigation } from 'app/core/navigation/navigation.types'
import { UserService } from 'app/core/user/user.service'
import { User } from 'app/core/user/user.types'
import { LanguagesComponent } from 'app/layout/common/languages/languages.component'
import { MessagesComponent } from 'app/layout/common/messages/messages.component'
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component'
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component'
import { SearchComponent } from 'app/layout/common/search/search.component'
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component'
import { NewCambioContraComponent } from 'app/layout/common/user/modal/new-cambio-contra/new-cambio-contra.component'
import { UserComponent } from 'app/layout/common/user/user.component'
import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'classy-layout',
  templateUrl: './classy.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FuseLoadingBarComponent,
    FuseVerticalNavigationComponent,
    NotificationsComponent,
    UserComponent,
    NgIf,
    MatIconModule,
    MatButtonModule,
    LanguagesComponent,
    FuseFullscreenComponent,
    SearchComponent,
    ShortcutsComponent,
    MessagesComponent,
    RouterOutlet,
    QuickChatComponent,
  ],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean
  navigation: Navigation
  user: any
  private _unsubscribeAll: Subject<any> = new Subject<any>()
  menu:any
  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _navigationService: NavigationService,
    private _userService: UserService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
    private _userSvc: AuthService,
    private _matDialog: MatDialog,
    private transloco: TranslocoService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear()
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const cambio = JSON.parse(localStorage.getItem('cambio'))
    if (cambio == 'False' || cambio == '') {
      this.showProfile()
    }
    this.transloco.langChanges$.subscribe((respo) => {
        this.updateNavigationTitles();
      });
    // Subscribe to the user service
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
      this.user = user
    })

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md')
      })
  }
  // Método para actualizar los títulos de navegación
  async updateNavigationTitles() {
    // Subscribe to navigation data
    // this._navigationService.navigation$.pipe(takeUntil(this._unsubscribeAll)).subscribe((navigation: Navigation) => {
    const menu:any =  await this.transformMenuJson(JSON.parse(localStorage.getItem("menus")));
    if(menu != undefined){
      menu.forEach((group) => {
        if (group.children) {
          group.children.forEach((child) => {
            child.title = this.transloco.translate(child.title);
          })
        }
      })
      this.navigation = menu
    }
        // console.log("==>",navigation)
      // })
  }
  transformMenuJson(menuJson: any): any {
    if (Array.isArray(menuJson)) {
        return menuJson.map(item => {
          // Transformar idPerfil a un array de números
          item.idPerfil = item.idPerfil.map(profile => profile.idPerfil);
    
          // Transformar idPerfil en submenús
          if (item.children && item.children.length > 0) {
            item.children = item.children.map(child => {
              child.idPerfil = child.idPerfil.map(profile => profile.idPerfil);
              return child;
            });
          }
    
          return item;
        });
      }
  }

  showProfile() {
    const $ = this._matDialog.open(NewCambioContraComponent, {
      disableClose: true,
    })

    $.afterClosed().subscribe((resp) => {
      if (resp.statusCode == 200) {
        localStorage.setItem('cambio', JSON.stringify('True'))

        this._router.navigate(['/providers/info'])
      }
    })
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null)
    this._unsubscribeAll.complete()
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle navigation
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name)

    if (navigation) {
      // Toggle the opened status
      navigation.toggle()
    }
  }
}

import { provideHttpClient } from '@angular/common/http'
import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID, inject } from '@angular/core'
import { LuxonDateAdapter } from '@angular/material-luxon-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router'
import { provideFuse } from '@fuse'
import { provideTransloco, TranslocoService } from '@ngneat/transloco'
import { firstValueFrom } from 'rxjs'
import { appRoutes } from 'app/app.routes'
import { provideAuth } from 'app/core/auth/auth.provider'
import { provideIcons } from 'app/core/icons/icons.provider'
import { mockApiServices } from 'app/mock-api'
import { TranslocoHttpLoader } from './core/transloco/transloco.http-loader'
import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es'
import { AuthService } from './core/auth/auth.service'

import { provideToastr } from 'ngx-toastr'
import { provideEnvironmentNgxMask } from 'ngx-mask'
import { ProvidersService } from '@fuse/services/providers/providers.service'

const maskConfig = {
  validation: false,
}

registerLocaleData(localeEs, 'es-ES')
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideToastr({
      preventDuplicates: true,
      timeOut: 2000,
      progressBar: true,
    }),
    provideEnvironmentNgxMask(maskConfig),
    // Material Date Adapter
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
    },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'D',
        },
        display: {
          dateInput: 'DDD',
          monthYearLabel: 'LLL yyyy',
          dateA11yLabel: 'DD',
          monthYearA11yLabel: 'LLLL yyyy',
        },
      },
    },

    // Transloco Config
    provideTransloco({
      config: {
        availableLangs: [
          {
            id: 'en',
            label: 'English',
          },
          {
            id: 'es',
            label: 'Español',
          },
        ],
        defaultLang: 'es',
        fallbackLang: 'es',
        reRenderOnLangChange: true,
        prodMode: true,
      },
      loader: TranslocoHttpLoader,
    }),
    {
      // Preload the default language before the app starts to prevent empty/jumping content
      provide: APP_INITIALIZER,
      useFactory: () => {
        const translocoService = inject(TranslocoService)
        const defaultLang = translocoService.getDefaultLang()
        translocoService.setActiveLang(defaultLang)

        const authService = inject(AuthService)
        const userData = authService.fill()

        const providersService = inject(ProvidersService)
        providersService.provider = JSON.parse(userData)

        // return () => firstValueFrom(translocoService.load(defaultLang))
        return () => translocoService.load(defaultLang).toPromise()
      },
      multi: true,
    },

    // Fuse
    provideAuth(),
    provideIcons(),
    provideFuse({
      mockApi: {
        delay: 0,
        services: mockApiServices,
      },
      fuse: {
        layout: 'classy',
        scheme: 'light',
        screens: {
          sm: '600px',
          md: '960px',
          lg: '1280px',
          xl: '1440px',
        },
        theme: 'theme-default',
        themes: [
          {
            id: 'theme-default',
            name: 'Default',
          },
          {
            id: 'theme-brand',
            name: 'Brand',
          },
          {
            id: 'theme-teal',
            name: 'Teal',
          },
          {
            id: 'theme-rose',
            name: 'Rose',
          },
          {
            id: 'theme-purple',
            name: 'Purple',
          },
          {
            id: 'theme-amber',
            name: 'Amber',
          },
        ],
      },
    }),
  ],
}

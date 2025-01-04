import { Routes } from '@angular/router'
import { PreviewComponent } from './preview/preview.component'
import { InvoicesComponent } from './invoices.component'
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component'
import { DoInvoiceComponent } from './do-invoice/do-invoice.component'

export default [
  {
    path: '',
    component: InvoicesComponent,
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full',
      },
      {
        path: 'info',
        component: PreviewComponent,
      },
      {
        path: 'detail/:society/:invoice',
        component: InvoiceDetailComponent,
      },
      {
        path: 'preview/:invoice',
        component: InvoiceDetailComponent,
        data: {
          preview: true,
        },
      },
      {
        path: 'process/:invoice',
        component: DoInvoiceComponent,
      },
    ],
  },
] as Routes
11

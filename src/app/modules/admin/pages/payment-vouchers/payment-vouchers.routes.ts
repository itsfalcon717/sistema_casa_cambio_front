import { Routes } from "@angular/router";
import { PublicationComponent } from "./publication/publication.component";
import { PaymentVouchersComponent } from "./payment-vouchers.component";

export default [
    {
        path: '',
        component: PaymentVouchersComponent,
        children: [
            {
                path: '',
                redirectTo: 'publication',
                pathMatch: 'full',
            },
            {
                path: 'publication',
                component: PublicationComponent,
            },
        ],
    },
] as Routes;
import { Routes } from "@angular/router";
import { PurchaseOrdersComponent } from "./purchase-orders.component";
import { PublicationComponent } from "./publication/publication.component";

export default [
    {
        path: '',
        component: PurchaseOrdersComponent,
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
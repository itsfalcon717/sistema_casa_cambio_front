import { Routes } from "@angular/router";
import { MigohesComponent } from "./migohes.component";
import { PreviewComponent } from "./preview/preview.component";

export default [
    {
        path: '',
        component: MigohesComponent,
        children: [
            {
                path: '',
                redirectTo: 'preview',
                pathMatch: 'full',
            },
            {
                path: 'preview',
                component: PreviewComponent,
            },
        ],
    },
] as Routes;

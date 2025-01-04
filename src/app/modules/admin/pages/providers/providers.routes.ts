import { Routes } from '@angular/router';
import { ProvidersComponent } from './providers.component';
import { RegisterComponent } from './register/register.component';
import { EvaluateComponent } from './evaluate/evaluate.component';
import { RegisterDataComponent } from './register-data/register-data.component';

export default [
    {
        path: '',
        component: ProvidersComponent,
        children: [
            {
                path: '',
                redirectTo: 'info',
                pathMatch: 'full',
            },
            {
                path: 'info',
                component: RegisterComponent,
            },
            {
                path: 'company-data',
                component: RegisterDataComponent,
            },
            {
                path: 'evaluate',
                component: EvaluateComponent,
            },
            {
                path: 'detail/:id',
                component: RegisterDataComponent,
            },
        ],
    },
] as Routes;

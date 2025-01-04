import { Routes } from '@angular/router'
import { SettingsComponent } from 'app/modules/admin/pages/settings/settings.component'
import { QuestionnairesComponent } from './questionnaires/questionnaires.component'
import { RolesComponent } from './roles/roles.component'
import { UsersComponent } from './users/users.component'

export default [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'questionnaires',
        component: QuestionnairesComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
] as Routes

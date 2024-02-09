import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { TableComponent } from './components/core/table/table.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: TableComponent
      }
    ]
  }
];

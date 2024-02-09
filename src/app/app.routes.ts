import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { TableComponent } from './components/core/user-table/table.component';
import { PostTableComponent } from './components/core/post-table/post-table.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: TableComponent
      },
      {
        path: 'posts',
        component: PostTableComponent
      }
    ]
  },
  { path: '**', redirectTo: '' } 
];

import { Routes } from '@angular/router';
import { TestApi } from './test-api/test-api';

export const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./features/posts/posts/posts-module').then(m => m.PostsModule)
  },
  { path: 'test-api', component: TestApi },
  { 
    path: 'posts', 
    loadChildren: () => import('./features/posts/posts/posts-module').then(m => m.PostsModule)
  },
  { path: '**', redirectTo: '' }
];

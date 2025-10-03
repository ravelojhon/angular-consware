import { Routes } from '@angular/router';
import { TestApi } from './test-api/test-api';
import { PostsList } from './features/posts/posts-list/posts-list';

export const routes: Routes = [
  { path: '', component: PostsList },
  { path: 'test-api', component: TestApi },
  { path: 'posts', component: PostsList },
  { path: '**', redirectTo: '' }
];

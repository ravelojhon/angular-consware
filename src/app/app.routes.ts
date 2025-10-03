import { Routes } from '@angular/router';
import { TestApi } from './test-api/test-api';
import { PostsList } from './features/posts/posts-list/posts-list';
import { PostDetail } from './features/posts/post-detail/post-detail';
import { PostForm } from './features/posts/post-form/post-form';

export const routes: Routes = [
  { path: '', component: PostsList },
  { path: 'test-api', component: TestApi },
  { path: 'posts', component: PostsList },
  { path: 'posts/new', component: PostForm },
  { path: 'posts/:id', component: PostDetail },
  { path: '**', redirectTo: '' }
];

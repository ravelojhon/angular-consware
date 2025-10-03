import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsList } from '../posts-list/posts-list';
import { PostDetail } from '../post-detail/post-detail';
import { PostForm } from '../post-form/post-form';

const routes: Routes = [
  { path: '', component: PostsList },
  { path: 'posts', component: PostsList },
  { path: 'posts/new', component: PostForm },
  { path: 'posts/:id/edit', component: PostForm },
  { path: 'posts/:id', component: PostDetail }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }

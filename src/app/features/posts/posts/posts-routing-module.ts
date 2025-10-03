import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsList } from '../posts-list/posts-list';
import { PostDetail } from '../post-detail/post-detail';
import { PostForm } from '../post-form/post-form';

const routes: Routes = [
  { path: '', component: PostsList },
  { path: 'new', component: PostForm },
  { path: ':id/edit', component: PostForm },
  { path: ':id', component: PostDetail }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }

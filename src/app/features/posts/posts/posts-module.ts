import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { PostsRoutingModule } from './posts-routing-module';
import { PostsList } from '../posts-list/posts-list';
import { PostDetail } from '../post-detail/post-detail';
import { PostForm } from '../post-form/post-form';
import { DeleteConfirmDialog } from '../delete-confirm-dialog/delete-confirm-dialog';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PostsRoutingModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    PostsList,
    PostDetail,
    PostForm,
    DeleteConfirmDialog
  ]
})
export class PostsModule { }

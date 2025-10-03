import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import {
  DeleteConfirmDialog,
  DeleteConfirmData,
} from '../delete-confirm-dialog/delete-confirm-dialog';
import { PostService } from '../../../core/services/post.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Post } from '../../../core/models/post.model';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  post: Post | null = null;
  loading = false;
  postId: number | null = null;

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const newPostId = +params['id'];
      if (newPostId && newPostId !== this.postId) {
        this.postId = newPostId;
        this.loadPost();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga el post específico por ID
   */
  loadPost(): void {
    if (!this.postId || this.destroy$.closed) return;

    this.loading = true;
    this.post = null;
    this.cdr.detectChanges();

    this.postService
      .getPost(this.postId!)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (post) => {
          if (!this.destroy$.closed) {
            this.post = post;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          if (!this.destroy$.closed) {
            this.notificationService.error('Error al cargar el post: ' + error.message);
            this.cdr.detectChanges();
            this.router.navigate(['/posts']);
          }
        },
      });
  }

  /**
   * Regresa a la lista de posts
   */
  goBack(): void {
    this.router.navigate(['/posts']);
  }

  /**
   * Edita el post actual
   */
  editPost(): void {
    if (this.post) {
      this.router.navigate(['/posts', this.post.id, 'edit']);
    }
  }

  /**
   * Elimina el post actual
   */
  deletePost(): void {
    if (!this.post) return;

    const dialogData: DeleteConfirmData = { post: this.post };

    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '500px',
      maxWidth: '90vw',
      data: dialogData,
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.performDelete();
      }
    });
  }

  /**
   * Ejecuta la eliminación del post
   */
  private performDelete(): void {
    if (!this.post) return;

    this.loading = true;
    this.cdr.detectChanges();

    // Simular eliminación exitosa (ya que la API no borra realmente)
    setTimeout(() => {
      this.loading = false;
      this.notificationService.success(`Post "${this.post!.title}" eliminado exitosamente`);
      this.cdr.detectChanges();
      this.router.navigate(['/posts']);
    }, 1000);
  }

  /**
   * Refresca el post actual
   */
  refreshPost(): void {
    if (this.postId && !this.destroy$.closed) {
      this.loadPost();
    }
  }
}

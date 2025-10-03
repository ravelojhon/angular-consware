import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { PostService } from '../../../core/services/post.service';
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
    MatDividerModule
  ],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss'
})
export class PostDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroy$ = new Subject<void>();

  post: Post | null = null;
  loading = false;
  postId: number | null = null;

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
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
    
    this.postService.getPost(this.postId!)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (post) => {
          if (!this.destroy$.closed) {
            this.post = post;
          }
        },
        error: (error) => {
          if (!this.destroy$.closed) {
            this.snackBar.open('Error al cargar el post: ' + error.message, 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/posts']);
          }
        }
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

    if (confirm(`¿Estás seguro de que quieres eliminar el post "${this.post.title}"?`)) {
      this.loading = true;
      this.postService.deletePost(this.post.id)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe({
          next: () => {
            if (!this.destroy$.closed) {
              this.snackBar.open('Post eliminado correctamente', 'Cerrar', {
                duration: 2000
              });
              this.router.navigate(['/posts']);
            }
          },
          error: (error) => {
            if (!this.destroy$.closed) {
              this.snackBar.open('Error al eliminar el post: ' + error.message, 'Cerrar', {
                duration: 3000
              });
            }
          }
        });
    }
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

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialog, DeleteConfirmData } from '../delete-confirm-dialog/delete-confirm-dialog';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models/post.model';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss'
})
export class PostsList implements OnInit, OnDestroy {
  private readonly postService = inject(PostService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  displayedColumns: string[] = ['id', 'title', 'userId', 'actions'];
  dataSource: Post[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los posts limitados a 10
   */
  loadPosts(): void {
    if (this.destroy$.closed) return;
    
    this.loading = true;
    this.dataSource = [];
    
    this.postService.getPosts()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (posts) => {
          if (!this.destroy$.closed) {
            this.dataSource = posts.slice(0, 10);
          }
        },
        error: (error) => {
          if (!this.destroy$.closed) {
            this.snackBar.open('Error al cargar los posts: ' + error.message, 'Cerrar', {
              duration: 3000
            });
          }
        }
      });
  }

  /**
   * Ver detalles de un post
   */
  viewPost(post: Post): void {
    this.router.navigate(['/posts', post.id]);
  }

  /**
   * Editar un post
   */
  editPost(post: Post): void {
    this.router.navigate(['/posts', post.id, 'edit']);
  }

  /**
   * Eliminar un post
   */
  deletePost(post: Post): void {
    const dialogData: DeleteConfirmData = { post };
    
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '500px',
      maxWidth: '90vw',
      data: dialogData,
      disableClose: false,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.performDelete(post);
      }
    });
  }

  /**
   * Ejecuta la eliminación del post
   */
  private performDelete(post: Post): void {
    this.loading = true;
    
    // Simular eliminación exitosa (ya que la API no borra realmente)
    setTimeout(() => {
      this.loading = false;
      this.snackBar.open(`Post "${post.title}" eliminado exitosamente`, 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.loadPosts();
    }, 1000);
  }

  /**
   * Refresca la lista de posts
   */
  refreshPosts(): void {
    if (!this.destroy$.closed) {
      this.loadPosts();
    }
  }

  /**
   * Navega al formulario de creación
   */
  createPost(): void {
    this.router.navigate(['/posts/new']);
  }
}

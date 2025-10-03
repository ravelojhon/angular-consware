import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models/post.model';

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
export class PostsList implements OnInit {
  private readonly postService = inject(PostService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'title', 'userId', 'actions'];
  dataSource: Post[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadPosts();
  }

  /**
   * Carga los posts limitados a 10
   */
  loadPosts(): void {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.dataSource = posts.slice(0, 10);
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar los posts: ' + error.message, 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  /**
   * Ver detalles de un post
   */
  viewPost(post: Post): void {
    this.snackBar.open(`Viendo post: ${post.title}`, 'Cerrar', {
      duration: 2000
    });
    // Aquí se implementaría la lógica para ver detalles
  }

  /**
   * Editar un post
   */
  editPost(post: Post): void {
    this.snackBar.open(`Editando post: ${post.title}`, 'Cerrar', {
      duration: 2000
    });
    // Aquí se implementaría la lógica para editar
  }

  /**
   * Eliminar un post
   */
  deletePost(post: Post): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el post "${post.title}"?`)) {
      this.postService.deletePost(post.id).subscribe({
        next: () => {
          this.snackBar.open('Post eliminado correctamente', 'Cerrar', {
            duration: 2000
          });
          this.loadPosts(); // Recargar la lista
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar el post: ' + error.message, 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }
}

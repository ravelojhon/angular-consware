import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../core/services/post.service';
import { Post } from '../core/models/post.model';

@Component({
  selector: 'app-test-api',
  imports: [CommonModule],
  templateUrl: './test-api.html',
  styleUrl: './test-api.scss'
})
export class TestApi implements OnInit {
  private readonly postService = inject(PostService);
  
  posts: Post[] = [];
  loading = false;
  error: string | null = null;
  selectedPost: Post | null = null;

  ngOnInit(): void {
    this.loadPosts();
  }

  /**
   * Carga todos los posts desde la API
   */
  loadPosts(): void {
    this.loading = true;
    this.error = null;
    
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts.slice(0, 10); // Mostrar solo los primeros 10 posts
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los posts: ' + error.message;
        this.loading = false;
      }
    });
  }

  /**
   * Carga un post específico por ID
   */
  loadPost(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.postService.getPost(id).subscribe({
      next: (post) => {
        this.selectedPost = post;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar el post: ' + error.message;
        this.loading = false;
      }
    });
  }

  /**
   * Limpia el post seleccionado
   */
  clearSelectedPost(): void {
    this.selectedPost = null;
  }
}

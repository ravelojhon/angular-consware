import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, CreatePost, UpdatePost } from '../models/post.model';

/**
 * Servicio para manejar operaciones CRUD de Posts
 * Utiliza HttpClient para comunicarse con la API REST
 */
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  /**
   * Obtiene todos los posts
   * @returns Observable con array de Posts
   */
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  /**
   * Obtiene un post específico por ID
   * @param id ID del post a obtener
   * @returns Observable con el Post
   */
  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo post
   * @param post Datos del post a crear
   * @returns Observable con el Post creado
   */
  createPost(post: CreatePost): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  /**
   * Actualiza un post existente
   * @param post Datos del post a actualizar
   * @returns Observable con el Post actualizado
   */
  updatePost(post: UpdatePost): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${post.id}`, post);
  }

  /**
   * Actualiza parcialmente un post existente
   * @param id ID del post a actualizar
   * @param post Datos parciales del post a actualizar
   * @returns Observable con el Post actualizado
   */
  patchPost(id: number, post: Partial<CreatePost>): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${id}`, post);
  }

  /**
   * Elimina un post
   * @param id ID del post a eliminar
   * @returns Observable vacío
   */
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

# 📡 API Documentation

Documentación completa de la API utilizada en la aplicación Angular CRUD Posts.

## 🌐 Base URL

```
https://jsonplaceholder.typicode.com
```

## 📝 Endpoints

### Posts

#### GET /posts

Obtiene todos los posts disponibles.

**URL**: `GET /posts`

**Respuesta**:

```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  }
]
```

#### GET /posts/:id

Obtiene un post específico por ID.

**URL**: `GET /posts/1`

**Parámetros**:

- `id` (number): ID del post

**Respuesta**:

```json
{
  "id": 1,
  "userId": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
```

#### POST /posts

Crea un nuevo post.

**URL**: `POST /posts`

**Body**:

```json
{
  "userId": 1,
  "title": "Nuevo Post",
  "body": "Contenido del nuevo post"
}
```

**Respuesta**:

```json
{
  "id": 101,
  "userId": 1,
  "title": "Nuevo Post",
  "body": "Contenido del nuevo post"
}
```

#### PUT /posts/:id

Actualiza un post completo.

**URL**: `PUT /posts/1`

**Parámetros**:

- `id` (number): ID del post

**Body**:

```json
{
  "id": 1,
  "userId": 1,
  "title": "Post Actualizado",
  "body": "Contenido actualizado del post"
}
```

**Respuesta**:

```json
{
  "id": 1,
  "userId": 1,
  "title": "Post Actualizado",
  "body": "Contenido actualizado del post"
}
```

#### PATCH /posts/:id

Actualiza parcialmente un post.

**URL**: `PATCH /posts/1`

**Parámetros**:

- `id` (number): ID del post

**Body**:

```json
{
  "title": "Solo título actualizado"
}
```

**Respuesta**:

```json
{
  "id": 1,
  "userId": 1,
  "title": "Solo título actualizado",
  "body": "Contenido original del post"
}
```

#### DELETE /posts/:id

Elimina un post.

**URL**: `DELETE /posts/1`

**Parámetros**:

- `id` (number): ID del post

**Respuesta**: `204 No Content`

## 🔧 Implementación en Angular

### PostService

```typescript
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(post: CreatePost): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(post: UpdatePost): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${post.id}`, post);
  }

  patchPost(id: number, post: Partial<CreatePost>): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Modelos de Datos

```typescript
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface CreatePost {
  userId: number;
  title: string;
  body: string;
}

export interface UpdatePost {
  id: number;
  userId?: number;
  title?: string;
  body?: string;
}
```

## 🚨 Códigos de Error

| Código | Descripción           | Acción                      |
| ------ | --------------------- | --------------------------- |
| 200    | OK                    | Operación exitosa           |
| 201    | Created               | Recurso creado exitosamente |
| 204    | No Content            | Eliminación exitosa         |
| 400    | Bad Request           | Datos inválidos             |
| 404    | Not Found             | Recurso no encontrado       |
| 500    | Internal Server Error | Error del servidor          |

## 🔄 Manejo de Errores

### En el Servicio

```typescript
getPosts(): Observable<Post[]> {
  return this.http.get<Post[]>(this.apiUrl).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error fetching posts:', error);
      return throwError(() => error);
    })
  );
}
```

### En el Componente

```typescript
loadPosts(): void {
  this.postService.getPosts().subscribe({
    next: (posts) => {
      this.dataSource = posts;
    },
    error: (error) => {
      this.notificationService.error('Error al cargar los posts');
    }
  });
}
```

## 📊 Limitaciones de la API

### JSONPlaceholder

- **Solo lectura**: Los cambios no se persisten
- **Límite de posts**: 100 posts disponibles (IDs 1-100)
- **Sin autenticación**: No requiere API key
- **Rate limiting**: Sin límites específicos
- **Posts creados**: Devuelven ID > 100 pero no existen realmente
- **Posts actualizados**: Los cambios no se guardan en la API

### Para Producción

- Implementar autenticación
- Agregar validación de datos
- Implementar paginación real
- Agregar filtros y búsqueda
- Implementar cache

## 🧪 Testing de la API

### Tests Unitarios

```typescript
describe('PostService', () => {
  it('should fetch posts', () => {
    const mockPosts: Post[] = [{ id: 1, userId: 1, title: 'Test', body: 'Test body' }];

    service.getPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });
});
```

### Tests de Integración

```typescript
it('should create post and return created post', () => {
  const newPost: CreatePost = {
    userId: 1,
    title: 'New Post',
    body: 'New body',
  };

  service.createPost(newPost).subscribe((post) => {
    expect(post.id).toBeDefined();
    expect(post.title).toBe(newPost.title);
  });
});
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
};
```

### Interceptors

```typescript
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.show();

    return next.handle(req).pipe(finalize(() => this.loadingService.hide()));
  }
}
```

## 📈 Monitoreo y Logs

### Logging de Requests

```typescript
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  console.log(`🚀 ${req.method} ${req.url}`);

  return next.handle(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        console.log(`✅ ${req.method} ${req.url} - ${event.status}`);
      }
    }),
    catchError(error => {
      console.error(`❌ ${req.method} ${req.url} - ${error.status}`);
      return throwError(() => error);
    })
  );
}
```

### Métricas de Performance

```typescript
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const start = Date.now();

  return next.handle(req).pipe(
    finalize(() => {
      const duration = Date.now() - start;
      console.log(`⏱️ ${req.method} ${req.url} - ${duration}ms`);
    })
  );
}
```

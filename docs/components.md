# 🧩 Component Guide

Guía completa de los componentes de la aplicación Angular CRUD Posts.

## 📋 Estructura de Componentes

```
src/app/
├── features/posts/
│   ├── posts-list/              # Lista de posts
│   ├── post-detail/             # Detalle de post
│   ├── post-form/               # Formulario de post
│   └── delete-confirm-dialog/   # Diálogo de confirmación
├── shared/
│   └── global-loading/          # Loading global
└── test-api/                    # Componente de prueba
```

## 📋 PostsList Component

### Propósito
Muestra una lista paginada de posts con funcionalidades CRUD.

### Características
- **Tabla responsiva** con Angular Material
- **Botones de acción** (Ver, Editar, Eliminar)
- **Loading states** durante operaciones
- **Manejo de errores** con notificaciones
- **Navegación** a otras vistas

### API
```typescript
export class PostsList implements OnInit, OnDestroy {
  // Propiedades
  displayedColumns: string[];
  dataSource: Post[];
  loading: boolean;

  // Métodos públicos
  viewPost(post: Post): void;
  editPost(post: Post): void;
  deletePost(post: Post): void;
  refreshPosts(): void;
  createPost(): void;
}
```

### Template
```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Lista de Posts</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <table mat-table [dataSource]="dataSource">
      <!-- Columnas de la tabla -->
    </table>
  </mat-card-content>
</mat-card>
```

### Estilos
```scss
.posts-list-container {
  padding: 1rem;
  
  .table-container {
    overflow-x: auto;
    border-radius: 4px;
  }
  
  .actions-container {
    display: flex;
    gap: 0.5rem;
  }
}
```

## 👁️ PostDetail Component

### Propósito
Muestra la información completa de un post específico.

### Características
- **Vista detallada** con información completa
- **Chips informativos** para ID y Usuario
- **Botones de acción** (Editar, Eliminar, Volver)
- **Loading states** durante carga
- **Manejo de errores** con redirección

### API
```typescript
export class PostDetail implements OnInit, OnDestroy {
  // Propiedades
  post: Post | null;
  loading: boolean;
  postId: number | null;

  // Métodos públicos
  goBack(): void;
  editPost(): void;
  deletePost(): void;
  refreshPost(): void;
}
```

### Template
```html
<mat-card class="post-card">
  <mat-card-header>
    <div class="post-meta">
      <mat-chip-set>
        <mat-chip>ID: {{ post.id }}</mat-chip>
        <mat-chip>Usuario {{ post.userId }}</mat-chip>
      </mat-chip-set>
    </div>
  </mat-card-header>
  <mat-card-content>
    <h2>{{ post.title }}</h2>
    <p>{{ post.body }}</p>
  </mat-card-content>
</mat-card>
```

## ✏️ PostForm Component

### Propósito
Formulario reactivo para crear y editar posts.

### Características
- **Formulario reactivo** con validaciones
- **Modo dual** (Crear/Editar)
- **Validaciones robustas** (required, minLength)
- **Mensajes de error** dinámicos
- **Loading states** durante operaciones

### API
```typescript
export class PostForm implements OnInit, OnDestroy {
  // Propiedades
  postForm: FormGroup;
  loading: boolean;
  isSubmitting: boolean;
  isEditMode: boolean;
  postId: number | null;
  currentPost: Post | null;

  // Métodos públicos
  onSubmit(): void;
  onReset(): void;
  onCancel(): void;
  getFormControl(controlName: string): AbstractControl | null;
  hasError(controlName: string, errorType: string): boolean;
  getErrorMessage(controlName: string): string;
}
```

### Template
```html
<form [formGroup]="postForm" (ngSubmit)="onSubmit()">
  <mat-form-field appearance="outline">
    <mat-label>Título del Post</mat-label>
    <input matInput formControlName="title">
    <mat-error *ngIf="hasError('title', 'required')">
      {{ getErrorMessage('title') }}
    </mat-error>
  </mat-form-field>
  
  <mat-form-field appearance="outline">
    <mat-label>Contenido del Post</mat-label>
    <textarea matInput formControlName="body" rows="6"></textarea>
    <mat-error *ngIf="hasError('body', 'required')">
      {{ getErrorMessage('body') }}
    </mat-error>
  </mat-form-field>
</form>
```

### Validaciones
```typescript
private initializeForm(): void {
  this.postForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    body: ['', [Validators.required, Validators.minLength(10)]],
    userId: [1, [Validators.required, Validators.min(1)]]
  });
}
```

## 🗑️ DeleteConfirmDialog Component

### Propósito
Diálogo de confirmación para eliminar posts.

### Características
- **Preview del post** a eliminar
- **Botones de confirmación** (Cancelar, Eliminar)
- **Diseño de advertencia** con colores apropiados
- **Responsive design** para móviles

### API
```typescript
export class DeleteConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmData
  ) {}

  onConfirm(): void;
  onCancel(): void;
}
```

### Template
```html
<div class="delete-dialog">
  <h2 mat-dialog-title>
    <mat-icon color="warn">warning</mat-icon>
    Confirmar Eliminación
  </h2>
  
  <mat-dialog-content>
    <div class="post-preview">
      <h3>{{ data.post.title }}</h3>
      <p>{{ data.post.body | slice:0:100 }}</p>
    </div>
  </mat-dialog-content>
  
  <mat-dialog-actions>
    <button mat-button (click)="onCancel()">Cancelar</button>
    <button mat-raised-button color="warn" (click)="onConfirm()">
      Eliminar
    </button>
  </mat-dialog-actions>
</div>
```

## 🔄 GlobalLoading Component

### Propósito
Overlay de loading global para operaciones HTTP.

### Características
- **Overlay completo** que cubre la pantalla
- **Spinner animado** de Angular Material
- **Mensaje de estado** dinámico
- **Diseño elegante** con blur de fondo

### API
```typescript
export class GlobalLoading implements OnInit, OnDestroy {
  loading: boolean;

  ngOnInit(): void;
  ngOnDestroy(): void;
}
```

### Template
```html
<div *ngIf="loading" class="global-loading-overlay">
  <div class="loading-content">
    <mat-spinner diameter="60"></mat-spinner>
    <p class="loading-text">Cargando...</p>
  </div>
</div>
```

## 🧪 Testing de Componentes

### PostsList Tests
```typescript
describe('PostsListComponent', () => {
  it('should load posts on init', () => {
    mockPostService.getPosts.and.returnValue(of(mockPosts));
    component.ngOnInit();
    expect(component.dataSource).toEqual(mockPosts);
  });

  it('should navigate to post detail', () => {
    component.viewPost(mockPost);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts', mockPost.id]);
  });
});
```

### PostForm Tests
```typescript
describe('PostFormComponent', () => {
  it('should validate required fields', () => {
    component.initializeForm();
    expect(component.postForm.get('title')?.hasError('required')).toBeTrue();
  });

  it('should create post when form is valid', () => {
    component.postForm.patchValue(mockCreatePost);
    component.onSubmit();
    expect(mockPostService.createPost).toHaveBeenCalled();
  });
});
```

## 🎨 Patrones de Diseño

### Component Communication
- **Parent → Child**: Input properties
- **Child → Parent**: Output events
- **Sibling → Sibling**: Services
- **Global State**: Services + Observables

### Lifecycle Hooks
```typescript
export class MyComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Inicialización
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Error Handling
```typescript
loadData(): void {
  this.service.getData().subscribe({
    next: (data) => this.handleSuccess(data),
    error: (error) => this.handleError(error)
  });
}
```

## 📱 Responsive Design

### Breakpoints
```scss
// Mobile first
@media (max-width: 480px) {
  .component {
    padding: 0.5rem;
  }
}

@media (min-width: 768px) {
  .component {
    padding: 1rem;
  }
}

@media (min-width: 1024px) {
  .component {
    padding: 2rem;
  }
}
```

### Flexbox Layout
```scss
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
}
```

## 🔧 Configuración de Componentes

### Standalone Components
```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss'
})
export class MyComponent {}
```

### Module Components
```typescript
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss'
})
export class MyComponent {}

@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule, MatCardModule],
  exports: [MyComponent]
})
export class MyModule {}
```

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { PostService } from '../../../core/services/post.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CreatePost, UpdatePost, Post } from '../../../core/models/post.model';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-post-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostForm implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly postService = inject(PostService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  postForm!: FormGroup;
  loading = false;
  isSubmitting = false;
  isEditMode = false;
  postId: number | null = null;
  currentPost: Post | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa el formulario reactivo
   */
  private initializeForm(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(15)]],
      body: ['', [Validators.required, Validators.minLength(20)]],
      userId: [1, [Validators.required, Validators.min(1)]],
    });
  }

  /**
   * Verifica si está en modo edición y carga los datos
   */
  private checkEditMode(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params['id'];
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.postId = +id;
        this.loadPostForEdit();
      }
    });
  }

  /**
   * Carga el post para edición
   */
  private loadPostForEdit(): void {
    if (!this.postId) return;

    this.loading = true;
    this.postService
      .getPost(this.postId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (post) => {
          this.currentPost = post;
          this.populateForm(post);
        },
        error: (error) => {
          this.notificationService.error('Error al cargar el post: ' + error.message);
          this.router.navigate(['/posts']);
        },
      });
  }

  /**
   * Pobla el formulario con los datos del post
   */
  private populateForm(post: Post): void {
    this.postForm.patchValue({
      title: post.title,
      body: post.body,
      userId: post.userId,
    });
  }

  /**
   * Obtiene el control del formulario para validaciones
   */
  getFormControl(controlName: string) {
    return this.postForm.get(controlName);
  }

  /**
   * Verifica si un campo tiene errores
   */
  hasError(controlName: string, errorType: string): boolean {
    const control = this.getFormControl(controlName);
    return !!(control && control.hasError(errorType) && control.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(controlName: string): string {
    const control = this.getFormControl(controlName);

    if (control?.hasError('required')) {
      return `${this.getFieldLabel(controlName)} es requerido`;
    }

    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldLabel(controlName)} debe tener al menos ${requiredLength} caracteres`;
    }

    if (control?.hasError('min')) {
      return `${this.getFieldLabel(controlName)} debe ser mayor a 0`;
    }

    return '';
  }

  /**
   * Obtiene la etiqueta del campo para mensajes de error
   */
  private getFieldLabel(controlName: string): string {
    const labels: Record<string, string> = {
      title: 'El título',
      body: 'El contenido',
      userId: 'El ID de usuario',
    };
    return labels[controlName] || controlName;
  }

  /**
   * Envía el formulario
   */
  onSubmit(): void {
    if (this.postForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.loading = true;

      if (this.isEditMode && this.postId) {
        this.updatePost();
      } else {
        this.createPost();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Crea un nuevo post
   */
  private createPost(): void {
    const formData: CreatePost = this.postForm.value;

    this.postService
      .createPost(formData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          this.notificationService.success('Post creado exitosamente');
          // Resetear loading antes de navegar
          this.loading = false;
          this.isSubmitting = false;
          // Navegar a la lista ya que el post no existe realmente en la API
          this.router.navigate(['/posts']);
        },
        error: (error) => {
          this.notificationService.error('Error al crear el post: ' + error.message);
        },
      });
  }

  /**
   * Actualiza un post existente
   */
  private updatePost(): void {
    if (!this.postId) return;

    const formData: UpdatePost = {
      id: this.postId,
      ...this.postForm.value,
    };

    this.postService
      .updatePost(formData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          this.notificationService.success('Post actualizado exitosamente');
          // Resetear loading antes de navegar
          this.loading = false;
          this.isSubmitting = false;
          // Navegar a la lista ya que los cambios no se persisten en la API
          this.router.navigate(['/posts']);
        },
        error: (error) => {
          this.notificationService.error('Error al actualizar el post: ' + error.message);
        },
      });
  }

  /**
   * Marca todos los campos como tocados para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.postForm.controls).forEach((key) => {
      const control = this.postForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Resetea el formulario
   */
  onReset(): void {
    this.postForm.reset({
      title: '',
      body: '',
      userId: 1,
    });
  }

  /**
   * Cancela y regresa a la lista
   */
  onCancel(): void {
    this.router.navigate(['/posts']);
  }
}

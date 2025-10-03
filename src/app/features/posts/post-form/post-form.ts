import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { PostService } from '../../../core/services/post.service';
import { CreatePost } from '../../../core/models/post.model';
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
    MatDividerModule
  ],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss'
})
export class PostForm implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly postService = inject(PostService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroy$ = new Subject<void>();

  postForm!: FormGroup;
  loading = false;
  isSubmitting = false;

  ngOnInit(): void {
    this.initializeForm();
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
      title: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      body: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],
      userId: [1, [
        Validators.required,
        Validators.min(1)
      ]]
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
    const labels: { [key: string]: string } = {
      title: 'El título',
      body: 'El contenido',
      userId: 'El ID de usuario'
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

      const formData: CreatePost = this.postForm.value;

      this.postService.createPost(formData)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.loading = false;
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: (createdPost) => {
            this.snackBar.open('Post creado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/posts', createdPost.id]);
          },
          error: (error) => {
            this.snackBar.open('Error al crear el post: ' + error.message, 'Cerrar', {
              duration: 3000
            });
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Marca todos los campos como tocados para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.postForm.controls).forEach(key => {
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
      userId: 1
    });
  }

  /**
   * Cancela y regresa a la lista
   */
  onCancel(): void {
    this.router.navigate(['/posts']);
  }
}

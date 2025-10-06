import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly configs: Record<NotificationType, MatSnackBarConfig> = {
    success: {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    },
    error: {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    },
    warning: {
      duration: 4000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    },
    info: {
      duration: 3000,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    }
  };

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, action = 'Cerrar'): void {
    this.snackBar.open(message, action, this.configs.success);
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, action = 'Cerrar'): void {
    this.snackBar.open(message, action, this.configs.error);
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, action = 'Cerrar'): void {
    this.snackBar.open(message, action, this.configs.warning);
  }

  /**
   * Muestra una notificación informativa
   */
  info(message: string, action = 'Cerrar'): void {
    this.snackBar.open(message, action, this.configs.info);
  }

  /**
   * Muestra una notificación personalizada
   */
  show(message: string, action = 'Cerrar', type: NotificationType = 'info'): void {
    this.snackBar.open(message, action, this.configs[type]);
  }
}

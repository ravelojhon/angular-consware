import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Post } from '../../../core/models/post.model';

export interface DeleteConfirmData {
  post: Post;
}

@Component({
  selector: 'app-delete-confirm-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './delete-confirm-dialog.html',
  styleUrl: './delete-confirm-dialog.scss'
})
export class DeleteConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmData
  ) {}

  /**
   * Confirma la eliminación
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Cancela la eliminación
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}

import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  type: 'error' | 'success' | 'warning' | 'info' | 'confirm';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string; // Opcional: para iconos personalizados
}

@Component({
  selector: 'app-generic-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.scss'
})
export class GenericDialogComponent {
  private dialogRef = inject(MatDialogRef<GenericDialogComponent>);
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  getButtonColor(): string {
    switch (this.data.type) {
      case 'error': return 'error-button';
      case 'success': return 'success-button';
      case 'warning': return 'warning-button';
      case 'info': return 'info-button';
      case 'confirm': return 'confirm-button';
      default: return 'primary-button';
    }
  }

  getButtonText(): string {
    switch (this.data.type) {
      case 'confirm': return this.data.confirmText || 'Confirmar';
      default: return 'Aceptar';
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

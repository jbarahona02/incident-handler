import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogData, GenericDialogComponent } from '../../components/generic-dialog/generic-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
   private dialog = inject(MatDialog);

  openDialog(data: DialogData): Observable<boolean> {
    // Cerrar diálogos existentes primero
    this.dialog.closeAll();
    
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '90%',
      maxWidth: '450px',
      maxHeight: '80vh',
      panelClass: 'generic-dialog',
      data,
      hasBackdrop: true,
      disableClose: data.type === 'confirm',
      autoFocus: false,
      enterAnimationDuration: 200,
      exitAnimationDuration: 200
    });

    return dialogRef.afterClosed();
  }

  showError(message: string, title: string = 'Error'): Observable<boolean> {
    return this.openDialog({
      type: 'error',
      title,
      message
    });
  }

  showSuccess(message: string, title: string = 'Éxito'): Observable<boolean> {
    return this.openDialog({
      type: 'success',
      title,
      message
    });
  }

  showWarning(message: string, title: string = 'Advertencia'): Observable<boolean> {
    return this.openDialog({
      type: 'warning',
      title,
      message
    });
  }

  showInfo(message: string, title: string = 'Información'): Observable<boolean> {
    return this.openDialog({
      type: 'info',
      title,
      message
    });
  }

  showConfirm(
    message: string, 
    title: string = 'Confirmar', 
    confirmText: string = 'Confirmar', 
    cancelText: string = 'Cancelar'
  ): Observable<boolean> {
    return this.openDialog({
      type: 'confirm',
      title,
      message,
      confirmText,
      cancelText
    });
  }
}

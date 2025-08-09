import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  handle(error: HttpErrorResponse): void {
    console.error('API Error:', error);

    if (error.status === 0) {
      this.snackBar.open('Network error: Please check your connection.', 'Close', { duration: 3000 });
    } else if (error.status === 401) {
      this.snackBar.open('Unauthorized. Please log in again.', 'Close', { duration: 3000 });
      this.router.navigate(['/auth/login']);
    } else if (error.status === 403) {
      this.snackBar.open('Access denied.', 'Close', { duration: 3000 });
      this.router.navigate(['/403']);
    } else if (error.status === 404) {
      this.snackBar.open('Resource not found.', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open(`Error ${error.status}: ${error.error?.message || error.message}`, 'Close', {
        duration: 3000,
      });
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.snackBar.open('Email and password are required.', 'Close', {
        duration: 3000
      });
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.authService.startTokenExpiryWatcher();

        const role = this.authService.getUserRole();
        const cleanRole = role?.replace('ROLE_', '');

        if (cleanRole === 'ADMIN' || cleanRole === 'USER') {
          this.router.navigate(['/dashboard/analytics']);
        } else {
          console.warn('Unknown role received from token:', role);
        }

        this.snackBar.open('✅ Login successful', 'Close', { duration: 2000 });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error:', err);
        this.snackBar.open('❌ Invalid credentials. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }
}

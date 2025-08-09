import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { RouterOutlet } from '@angular/router';
import { LoadingBarComponent } from './components/loading-bar/loading-bar'; 

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, LoadingBarComponent]
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
  }
}
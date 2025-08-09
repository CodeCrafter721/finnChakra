import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" *ngIf="spinnerService.loading$ | async">
      <div class="loader"></div>
    </div>
  `,
  styleUrls: ['./spinner.scss']
})
export class SpinnerComponent {
  constructor(public spinnerService: SpinnerService) {}
}

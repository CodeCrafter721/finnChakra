import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    <mat-progress-bar
      mode="indeterminate"
      *ngIf="spinnerService.loading$ | async"
      class="loading-bar"
      color="primary"
    ></mat-progress-bar>
  `,
  styleUrls: ['./loading-bar.scss']
})
export class LoadingBarComponent {
  constructor(public spinnerService: SpinnerService) {}
}

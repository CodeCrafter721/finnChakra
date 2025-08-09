import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recurring-trigger',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './recurring-trigger.html',
  styleUrls: ['./recurring-trigger.scss']
})
export class RecurringTriggerComponent {
  constructor() {}

  triggerRecurring() {
    console.log('Triggering recurring transactions...');
  }
}

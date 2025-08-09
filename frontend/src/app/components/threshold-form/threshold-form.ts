import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BudgetThreshold } from '../../models/budget.model';

@Component({
  selector: 'app-threshold-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './threshold-form.html',
  styleUrls: ['./threshold-form.scss']
})
export class ThresholdFormComponent {
  model: BudgetThreshold;

  constructor(
    public dialogRef: MatDialogRef<ThresholdFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BudgetThreshold
  ) {
    this.model = { ...data };
  }

  save() {
    this.dialogRef.close(this.model);
  }

  cancel() {
    this.dialogRef.close();
  }
}

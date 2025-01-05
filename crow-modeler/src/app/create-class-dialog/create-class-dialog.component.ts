import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-create-class-dialog',
  standalone: true,
  imports: [MatFormField, MatLabel, MatCheckbox],
  templateUrl: './create-class-dialog.component.html',
  styleUrl: './create-class-dialog.component.css'
})

export class CreateClassDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
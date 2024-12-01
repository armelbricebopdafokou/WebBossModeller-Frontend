import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-edit-node-dialog',
  standalone: true,
  imports: [FormsModule], // FormsModule importieren
  templateUrl: './edit-node-dialog.component.html',
  styleUrls: ['./edit-node-dialog.component.css']
})
export class EditNodeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.data);
  }
}


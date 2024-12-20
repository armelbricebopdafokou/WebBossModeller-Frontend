import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-node-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-node-dialog.component.html',
  styleUrls: ['./edit-node-dialog.component.css'],
})
export class EditNodeDialogComponent {
  columns: Column[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.columns) {
      this.columns = JSON.parse(JSON.stringify(data.columns)); // Tiefenkopie
    }
  }

  addColumn(): void {
    this.columns.push({
      name: '',
      datatype: 'string',
      pk: false,
      nn: false,
      unique: false,
      check: '',
      default: '',
    });
  }

  removeColumn(index: number): void {
    this.columns.splice(index, 1);
  }

  save(): void {
    console.log('Speichern der Daten:', this.columns);
    this.dialogRef.close({ ...this.data, columns: this.columns });
  }

  onNoClick(): void {
    if (this.hasUnsavedChanges()) {
      const confirmClose = confirm('Es gibt ungespeicherte Änderungen. Möchten Sie wirklich schließen?');
      if (confirmClose) {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }

  hasUnsavedChanges(): boolean {
    return JSON.stringify(this.columns) !== JSON.stringify(this.data.columns);
  }
}

interface Column {
  name: string;
  datatype: string;
  pk: boolean;
  nn: boolean;
  unique: boolean;
  check: string;
  default: string;
}

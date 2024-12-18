import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop'; // Import DragDropModule
import { Inject } from '@angular/core';

@Component({
  selector: 'app-edit-node-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule], // DragDropModule hier hinzufügen
  templateUrl: './edit-node-dialog.component.html',
  styleUrls: ['./edit-node-dialog.component.css'],
})
export class EditNodeDialogComponent {
  columns = [
    {
      name: 'Spalte 1',
      datatype: 'string',
      pk: false,
      nn: false,
      unique: false,
      check: '',
      default: '',
    },
    {
      name: 'Spalte 2',
      datatype: 'integer',
      pk: false,
      nn: false,
      unique: false,
      check: '',
      default: '',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<EditNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

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

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({ ...this.data, columns: this.columns });
  }

  // Methode zum Verschieben von Elementen
  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
}

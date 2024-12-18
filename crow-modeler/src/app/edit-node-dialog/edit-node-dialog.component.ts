import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-edit-node-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-node-dialog.component.html',
  styleUrls: ['./edit-node-dialog.component.css'],
})
export class EditNodeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  // Initialisieren Sie die Spalten-Datenstruktur
  columns = [
    {
      name: '',
      datatype: 'string',
      pk: false,
      nn: false,
      unique: false,
      check: '',
      default: '',
    },
  ];

  // Methode, um eine neue Spalte hinzuzufügen
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

  // Abbrechen und Speichern-Methoden
  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({ ...this.data, columns: this.columns });
  }
}

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-node-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './edit-node-dialog.component.html',
  styleUrls: ['./edit-node-dialog.component.css']
})
export class EditNodeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      name: string;
      attributes: {
        name: string;
        selected?: boolean;
        datatype?: string;
        pk?: boolean;
        nn?: boolean;
        unique?: boolean;
        check?: string;
        defaultValue?: string;
        fkTableName?: string;
        fkColumnName?: string;
      }[];
    }
  ) { }

  addAttribute() {
    this.data.attributes.push({
      name: '',
      selected: false,
      datatype: 'string',
      pk: false,
      nn: false,
      unique: false,
      check: '',
      defaultValue: '',
      fkTableName: '',
      fkColumnName: ''
    });
  }

  removeAttribute(index: number) {
    this.data.attributes.splice(index, 1);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}

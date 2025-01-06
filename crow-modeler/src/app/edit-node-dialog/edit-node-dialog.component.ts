import { Component, Inject, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-edit-node-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule
  ],
  templateUrl: './edit-node-dialog.component.html',
  styleUrls: ['./edit-node-dialog.component.css']
})
export class EditNodeDialogComponent {
  @Output() attributesUpdated = new EventEmitter<any[]>();

  constructor(
    public dialogRef: MatDialogRef<EditNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      className: string;
      items: { //attributes
        name: string;
        selected?: boolean;
        datatype?: string;
        iskey?: boolean; //ehemals pk
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
    const newAttribute = {
      name: '',
      selected: false,
      datatype: 'string',
      iskey: false, //ehemal pk
      nn: false,
      unique: false,
      check: '',
      defaultValue: '',
      fkTableName: '',
      fkColumnName: ''
    };
    this.data.items.push(newAttribute);
    this.attributesUpdated.emit(this.data.items);
  }

  removeAttribute(index: number) {
    this.data.items.splice(index, 1);
    this.attributesUpdated.emit(this.data.items);
  }

  onDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.data.items, event.previousIndex, event.currentIndex);
    this.attributesUpdated.emit(this.data.items);
  }

  @HostListener('window:beforeunload', ['$event'])
  confirmClose(event: BeforeUnloadEvent): void {
    event.preventDefault();
    event.returnValue = '';
  }

  onCancel(): void {
    const confirmClose = confirm('Möchten Sie wirklich schließen, ohne zu speichern?');
    if (confirmClose) {
      this.dialogRef.close();
    }
  }

  onSave(): void {
    this.attributesUpdated.emit(this.data.items);
    this.dialogRef.close(this.data);
  }
}

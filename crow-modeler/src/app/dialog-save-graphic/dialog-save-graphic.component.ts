import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-save-graphic',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatButtonModule],
  templateUrl: './dialog-save-graphic.component.html',
  styleUrl: './dialog-save-graphic.component.css'
})
export class DialogSaveGraphicComponent {
  projectName:any
  isClosing = false;
  constructor(public matDialogRef: MatDialogRef<DialogSaveGraphicComponent>){
    matDialogRef.beforeClosed().subscribe(() => {
      if (!this.isClosing) {
        this.isClosing = true;
        matDialogRef.close(this.projectName);
      }
    });
  }
  

}

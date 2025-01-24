import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-import',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDialogModule,
    FormsModule, MatDividerModule, ReactiveFormsModule, MatButtonModule
  ],
  templateUrl: './dialog-import.component.html',
  styleUrl: './dialog-import.component.css'
})
export class DialogImportComponent implements OnInit {

  form: FormGroup | any;

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogImportComponent>
  ){}

  ngOnInit(): void {
      this.form = this.fb.group({
        host: ['', [Validators.required]],
        database: ['', [Validators.required]],
        schema: ['', [Validators.required]],
        user: ['', [Validators.required]],
        password: ['', [Validators.required]],
        type: ['', [Validators.required]]
      });
  }


  save() {
    console.log(this.form!.value)
    this.dialogRef.close(this.form!.value);
  }

  close() {
    this.dialogRef.close();
  }

}

import { ChangeDetectionStrategy, Component, Inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { SqlService } from '../services/sql.service';
import { Table } from '../interfaces/graphic';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-export',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatCheckboxModule,MatInputModule, MatSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-export.component.html',
  styleUrl: './dialog-export.component.css'
})
export class DialogExportComponent {

  databasename:string=''
  schema:string = ''
  type:string|undefined
  isChecked: boolean = false

  constructor(private toastr: ToastrService, private service: SqlService, @Inject(MAT_DIALOG_DATA) public data: any){
   
  }

  exportToSQL() {
    this.data = JSON.parse(this.data)
    console.log(this.data.nodeDataArray) 

    let obj: any = {
      "databaseName": this.databasename,
      "schemaName": this.schema,
      "tables": this.data.nodeDataArray,
      "isCaseSensitive": this.isChecked
    }
    
    console.log(obj)

    switch(this.type) {
        case 'MSSQL':
            this.service.getSQLCodeMssql(this.data).subscribe({
                next: (data)=> {
                   console.log('got value ' + data);
                 },
                 error: (err)=> {
                  //this.errorMessage = err;
                  this.toastr.error(err.message, 'Error');
                 },
                complete: ()=> {
                  this.toastr.success('This is a success message!', 'Success');
                 }
               })
        break;
        case 'MYSQL':
            this.service.getSQLCodeMysql(this.data).subscribe({
                next: (data)=> {
                   console.log('got value ' + data);
                 },
                 error: (err)=> {
                  //this.errorMessage = err;
                  this.toastr.error(err.message, 'Error');
                 },
                complete: ()=> {
                  this.toastr.success('This is a success message!', 'Success');
                 }
               })
        break;

        case 'POSTGRESSQL':
            this.service.getSQLCodePostgres(this.data).subscribe({
                next: (data)=> {
                   console.log('got value ' + data);
                 },
                 error: (err)=> {
                  //this.errorMessage = err;
                  this.toastr.error(err.message, 'Error');
                 },
                complete: ()=> {
                  this.toastr.success('This is a success message!', 'Success');
                 }
               })
        break;
    }
    
    
  
  
  }

  

  
}

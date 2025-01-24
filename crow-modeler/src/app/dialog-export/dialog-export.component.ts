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
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FileSaverModule, FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-dialog-export',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatCheckboxModule,MatInputModule, 
    MatProgressBarModule,FileSaverModule,
    MatSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-export.component.html',
  styleUrl: './dialog-export.component.css'
})
export class DialogExportComponent {

  databasename:string=''
  filename:string=''
  schema:string = ''
  type:string|undefined
  isChecked: boolean = false
  isProgress:boolean = false

  constructor(private toastr: ToastrService, private filesaver: FileSaverService,
    private service: SqlService, 
    @Inject(MAT_DIALOG_DATA) public data: any){
   
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
    
      

      switch(this.type) {
          case 'MSSQL':
              this.service.getSQLCodeMssql(obj).subscribe({
                  next: (data)=> {
                    //console.log('got value ' + data);
                    this.onSaveFile(data)
                  },
                  error: (err)=> {
                    console.log(err)
                    //this.errorMessage = err;
                    this.toastr.error(err.message, 'Error');
                  },
                  complete: ()=> {
                    this.toastr.success('This is a success message!', 'Success');
                  }
                })
          break;
          case 'MYSQL':
              this.service.getSQLCodeMysql(obj).subscribe({
                  next: (data)=> {
                    //console.log('got value ' + data);
                    this.onSaveFile(data)
                  },
                  error: (err)=> {
                    //this.errorMessage = err;
                    console.log(err)
                    this.toastr.error(err.message, 'Error');
                  },
                  complete: ()=> {
                    this.toastr.success('This is a success message!', 'Success');
                  }
                })
          break;

          case 'POSTGRESSQL':
              this.service.getSQLCodePostgres(obj).subscribe({
                  next: (data)=> {
                    //console.log('got value ' + data);
                    this.onSaveFile(data)
                  },
                  error: (err)=> {
                    //this.errorMessage = err;
                    console.log(err)
                    this.toastr.error(err.message, 'Error');
                  },
                  complete: ()=> {
                    this.toastr.success('This is a success message!', 'Success');
                  }
                })
          break;
      }
  
  }

  public onSaveFile(content: any):void{
    console.log(content)
    this.filename = this.filename + '.sql';
    console.log(this.filename)
    // Split the SQL content into chunks
    const chunkSize = 1024 * 1024; // 1MB chunks
    const chunks = [];
    const totalChunks = Math.ceil(content.length / chunkSize);
    this.isProgress = true;
    for (let i = 0; i < totalChunks; i++) {
        
    }
    try {
      this.isProgress = false;
      const blob = new Blob([content], { type: 'text/plain' });
      this.filesaver.save(blob, this.filename);
    }
    catch (e)
    {
      console.log(e) ;
    }
       
  }
  
  

  
}

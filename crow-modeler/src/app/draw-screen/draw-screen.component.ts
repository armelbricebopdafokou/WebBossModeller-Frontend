import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CreateClassDialogComponent } from '../create-class-dialog/create-class-dialog.component';
import { GojsAngularModule } from 'gojs-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GojsDiagramComponent } from '../gojs-diagram/gojs-diagram.component';
import { EditNodeDialogComponent } from '../edit-node-dialog/edit-node-dialog.component';
import { HeaderComponent } from '../header/header.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio'
import {MatButtonModule} from '@angular/material/button'
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as go from 'gojs';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DialogExportComponent } from '../dialog-export/dialog-export.component';
import { DialogSaveGraphicComponent } from '../dialog-save-graphic/dialog-save-graphic.component';
import { BrowserModule } from '@angular/platform-browser';
import { DialogImportComponent } from '../dialog-import/dialog-import.component';
import { SqlService } from '../services/sql.service';


@Component({
  selector: 'app-draw-screen',
  standalone: true,
  imports: [
    GojsAngularModule,
    GojsDiagramComponent,
    MatSidenavModule,
    HeaderComponent,
    MatTooltipModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatRadioModule,
    MatButtonModule,
    MatDialogModule // Wichtig für die Verwendung von MatDialog
  ],
  templateUrl: './draw-screen.component.html',
  styleUrls: ['./draw-screen.component.css']
})
export class DrawScreenComponent {
  title = 'crow-modeler';
  events: string[] = [];
  opened: boolean = true;
  projects:any = [];
  selectedProject:any;

  @ViewChild('drawScreen', { static: false }) drawScreen!: ElementRef;
  @ViewChild(GojsDiagramComponent, { static: false }) diagramComponent!: GojsDiagramComponent;

  public selectedNode: any = null;
  text: string = 'color here';
 
  constructor(public dialog: MatDialog, private toastr: ToastrService, private sqlService: SqlService,
     private userService: UserService) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateClassDialogComponent, {
      width: '850px',
      data: { value1: '', value2: '', checkboxValue: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }
    
ngAfterViewInit(){  
  document.body.style.backgroundColor='#ffffff';
}

  nodeDataArray = [
    {
      key: 0,
      className: 'Produkt',
      location: new go.Point(250, 250),
      items: [
        { name: 'ProductID', iskey: true, notNull: true },
        { name: 'ProductName', iskey: false, notNull: true },
        { name: 'ItemDescription', iskey: false, notNull: false },
        { name: 'WholesalePrice', iskey: false, notNull: false },
        { name: 'ProductPhoto', iskey: false, notNull: false }
      ],
      inheritedItems: [
        { name: 'SupplierID', iskey: false, notNull: true },
        { name: 'CategoryID', iskey: false, notNull: true }
      ]
    },
    {
      key: 1,
      className: 'Kategorie',
      location: new go.Point(500, 0),
      items: [
        { name: 'CategoryID', iskey: true, notNull: true },
        { name: 'CategoryName', iskey: false, notNull: true },
        { name: 'Description', iskey: false, notNull: false }
      ],
      inheritedItems: [
        { name: 'SupplierID', iskey: false, notNull: true },
        { name: 'CategoryID', iskey: false, notNull: true }
      ]
    }
  ];

  linkDataArray = [
    { from: 0, to: 1, weak: true, fromArrow: 'BackwardLineFork', toArrow: 'LineFork' }
  ];

  public model: go.GraphLinksModel = new go.GraphLinksModel({
    copiesArrays: true,
    copiesArrayObjects: true,
    nodeDataArray: this.nodeDataArray,
    linkDataArray: this.linkDataArray
  });

  public setSelectedNode(node: any) {
    this.selectedNode = node;
  }

  public createClass() {
    this.model.startTransaction('make new node');
    this.model.addNodeData({
      key: 'Zulieferer',
      className: 'Zulieferer',
      location: new go.Point(0, 15),
      items: [
        { name: 'SupplierID', iskey: true, notNull: false },
        { name: 'SupplierName', iskey: false, notNull: false },
        { name: 'Description', iskey: false, notNull: false }
      ],
      inheritedItems: [
        { name: 'SupplierID', iskey: false, notNull: false },
        { name: 'CategoryID', iskey: false, notNull: false }
      ]
    });
    this.model.commitTransaction('make new node');
  }

  exportImage() {
    console.log('Exporting diagram as SVG');
    if (this.diagramComponent) {
      const diagram = this.diagramComponent.diagram;
      if (diagram) {
        const svg = diagram.makeSvg({ scale: 1 }) as SVGElement;
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'diagram_export.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log('SVG export successful');
      } else {
        console.error('No GoJS diagram found');
      }
    }
  }

  zoomIn() {
    if (this.diagramComponent && this.diagramComponent.diagram.scale < 3) {
      this.diagramComponent.diagram.scale += 0.1;
    }
  }

  zoomOut() {
    if (this.diagramComponent && this.diagramComponent.diagram.scale > 0.2) {
      this.diagramComponent.diagram.scale -= 0.1;
    }
  }

  get toJson() {
      return this.model.toJson()
  }

  saveGraphic() {
    const dialogReference = this.dialog.open(DialogSaveGraphicComponent,{});
    dialogReference.afterClosed().subscribe(result=>{
      if(result !== undefined)
      {
        console.log(result)
        let grafik = JSON.parse(this.toJson);
        grafik.class = result
        let obj = {
          "graphics": grafik
        }

        this.userService.saveGraphics(obj).subscribe({
          next: (data)=> {
             console.log('got value ' + data.message);
           },
           error: (err)=> {
            //this.errorMessage = err;
            this.toastr.error(err.message, 'Error');
           },
          complete: ()=> {
            this.toastr.success('This is a success message!', 'Success');
           }
         })


      }
      
    })

      // Öffnet Dialog
     // const dialog1 = document.querySelector(".saveProjectDialog") as HTMLDialogElement;
     
     // dialog1?.showModal();
      // Schließt Dialog
      /*const closeButton = document.getElementById("closeSave");
      closeButton?.addEventListener("click", () => {
        dialog1?.close();
      });

      const savedButton = document.getElementById("saveButton");
      savedButton?.addEventListener("click", () => {

        let grafik = JSON.parse(this.toJson);
        grafik.class = (document.getElementById("projectName") as HTMLInputElement)?.value.toString();

        let obj = {
          "graphics": grafik
        }
        console.log(obj);
        
        this.userService.saveGraphics(obj).subscribe({
          next: (data)=> {
             console.log('got value ' + data.message);
           },
           error: (err)=> {
            //this.errorMessage = err;
            this.toastr.error(err.message, 'Error');
           },
          complete: ()=> {
            this.toastr.success('This is a success message!', 'Success');
           }
         })

        dialog1?.close();
      });*/
     
  }
  openDialogExport() {
      const dialogRef = this.dialog.open(DialogExportComponent, {
        data: this.toJson
      });

      /*dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });*/
  }

  openProject()
  {
    this.projects = []
    this.userService.FetchGraphics().subscribe({
      next: (res)=> {
        for(let i in res.data)
        {
          this.projects.push(JSON.parse(JSON.stringify(res.data[i])))
        }
        console.log(this.projects)
       },
       error: (err)=> {
        //this.errorMessage = err;
        this.toastr.error(err.message, 'Error');
       },
      complete: ()=> {
        //this.toastr.success('This is a success message!', 'Success');

        // Öffnet Dialog
        const dialog = document.querySelector(".openProjectDialog") as HTMLDialogElement;
        dialog?.showModal();
        // Schließt Dialog
        const closeButton = document.getElementById("closeButton");
        closeButton?.addEventListener("click", () => {
          dialog?.close();
        });
      
       }
     })
  



  }

  openSelectedProject()
  {
    console.log(this.selectedProject)
  }

  importFromDatabase()
  {
    const dialogImport = this.dialog.open(DialogImportComponent,{
      width: '500px'
    });

    dialogImport.afterClosed().subscribe(
      data => {
        if(data !== undefined)
        {
          
          switch (data.type)
          {
              case'MSSQL':
              this.sqlService.importFromMssql(data.host, data.database, data.schema, data.user, data.password).subscribe({
                next: (data)=> {
                  data = JSON.parse(JSON.stringify(data))
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
              case'MYSQL':
              this.sqlService.importFromMysql(data.host, data.database, data.schema, data.user, data.password).subscribe({
                next: (data)=> {
                  data = JSON.parse(JSON.stringify(data))
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
              case'POSTGRESQL':
              this.sqlService.importFromPostgresql(data.host, data.database, data.schema, data.user, data.password).subscribe({
                next: (data:any)=> {
                  data = JSON.parse(JSON.stringify(data))
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
  );  

  }
}

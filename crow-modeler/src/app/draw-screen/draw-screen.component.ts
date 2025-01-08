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

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as go from 'gojs';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DialogExportComponent } from '../dialog-export/dialog-export.component';


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

  @ViewChild('drawScreen', { static: false }) drawScreen!: ElementRef;
  @ViewChild(GojsDiagramComponent, { static: false }) diagramComponent!: GojsDiagramComponent;

  public selectedNode: any = null;
  text: string = 'color here';
 
  constructor(public dialog: MatDialog, private toastr: ToastrService,
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
        { name: 'ProductID', iskey: true, notNull: false },
        { name: 'ProductName', iskey: false, notNull: false },
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
        { name: 'CategoryID', iskey: true, notNull: false },
        { name: 'CategoryName', iskey: false, notNull: false },
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
    let obj = {
      "graphics": this.toJson
    }
    console.log(this.toJson);
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

    this.userService.FetchGraphics().subscribe({
      next: (data)=> {
        this.projects.push(JSON.parse(data.data));
        
       },
       error: (err)=> {
        //this.errorMessage = err;
        this.toastr.error(err.message, 'Error');
       },
      complete: ()=> {
        this.toastr.success('This is a success message!', 'Success');

        
        // Öffnet Dialog
        const dialog = document.querySelector("dialog");
        dialog?.showModal();
        // Schließt Dialog
        const closeButton = document.getElementById("closeButton");
        closeButton?.addEventListener("click", () => {
          dialog?.close();
        });
        const diagramButtons = document.querySelectorAll('.diagram-button');
        // Logik zum Öffnen eines Projekts
        // Add click event listeners to diagram buttons
        diagramButtons.forEach(button => {
          button.addEventListener('click', () => {
            const selectedDiagram = button.getAttribute('data-value');
            let openFilename = `${selectedDiagram}.json`;
            console.log(`Selected: ${selectedDiagram}, filename: ${openFilename}`);
            // Add your logic to open the selected diagram here
            // For example, you could close the dialog after selection
            dialog?.close();
          });
        }); 

       }
     })
  



  }

  
}

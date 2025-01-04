import { Component, ElementRef, ViewChild } from '@angular/core';
import { CreateClassDialogComponent } from '../create-class-dialog/create-class-dialog.component';
import { GojsAngularModule } from 'gojs-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GojsDiagramComponent } from '../gojs-diagram/gojs-diagram.component';
import { EditNodeDialogComponent } from '../edit-node-dialog/edit-node-dialog.component';
import { HeaderComponent } from '../header/header.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SideComponent } from '../side/side.component';
import { InspectorComponent } from '../inspector/inspector.component';
import * as go from 'gojs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-draw-screen',
  standalone: true,
  imports: [
    GojsAngularModule,
    GojsDiagramComponent,
    MatSidenavModule,
    HeaderComponent,
    SideComponent,
    InspectorComponent,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatDialogModule // Wichtig für die Verwendung von MatDialog
  ],
  templateUrl: './draw-screen.component.html',
  styleUrls: ['./draw-screen.component.css']
})
export class DrawScreenComponent {
  title = 'crow-modeler';
  events: string[] = [];
  opened: boolean = true;

  @ViewChild('drawScreen', { static: false }) drawScreen!: ElementRef;
  @ViewChild(GojsDiagramComponent, { static: false }) diagramComponent!: GojsDiagramComponent;

  public selectedNode: any = null;
  text: string = 'color here';

  constructor(public dialog: MatDialog) { }

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

  nodeDataArray = [
    {
      key: 'Produkt',
      className: 'Produkt',
      location: new go.Point(250, 250),
      items: [
        { name: 'ProductID', iskey: true, figure: 'Decision', color: 'purple' },
        { name: 'ProductName', iskey: false, figure: 'Hexagon', color: 'blue' },
        { name: 'ItemDescription', iskey: false, figure: 'Hexagon', color: 'blue' },
        { name: 'WholesalePrice', iskey: false, figure: 'Circle', color: 'green' },
        { name: 'ProductPhoto', iskey: false, figure: 'TriangleUp', color: 'red' }
      ],
      inheritedItems: [
        { name: 'SupplierID', iskey: false, figure: 'Decision', color: 'purple' },
        { name: 'CategoryID', iskey: false, figure: 'Decision', color: 'purple' }
      ]
    },
    {
      key: 'Kategorie',
      className: 'Kategorie',
      location: new go.Point(500, 0),
      items: [
        { name: 'CategoryID', iskey: true, figure: 'Decision', color: 'purple' },
        { name: 'CategoryName', iskey: false, figure: 'Hexagon', color: 'blue' },
        { name: 'Description', iskey: false, figure: 'Hexagon', color: 'blue' }
      ],
      inheritedItems: [
        { name: 'SupplierID', iskey: false, figure: 'Decision', color: 'purple' },
        { name: 'CategoryID', iskey: false, figure: 'Decision', color: 'purple' }
      ]
    }
  ];

  linkDataArray = [
    { from: 'Produkt', to: 'Kategorie', weak: true, fromArrow: 'BackwardLineFork', toArrow: 'LineFork' }
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
        { name: 'SupplierID', iskey: true, figure: 'Decision', color: 'purple' },
        { name: 'SupplierName', iskey: false, figure: 'Hexagon', color: 'blue' },
        { name: 'Description', iskey: false, figure: 'Hexagon', color: 'blue' }
      ],
      inheritedItems: [
        { name: 'SupplierID', iskey: false, figure: 'Decision', color: 'purple' },
        { name: 'CategoryID', iskey: false, figure: 'Decision', color: 'purple' }
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

  toJson() {
    console.log(this.model.toJson());
  }

  onButtonClick() {
    console.log('Button clicked!');
  }
}

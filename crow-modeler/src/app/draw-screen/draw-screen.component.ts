import { Component } from '@angular/core';
import { CreateClassDialogComponent } from '../create-class-dialog/create-class-dialog.component';
import { GojsAngularModule } from 'gojs-angular';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip'; // Hinzufügen des Tooltip-Moduls
import { GojsDiagramComponent } from '../gojs-diagram/gojs-diagram.component';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
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
    RouterLink,
    RouterLink,
    RouterLinkActive, SideComponent, InspectorComponent,
    FormsModule,
    MatTooltipModule // Hinzufügen des MatTooltipModule
  ],
  templateUrl: './draw-screen.component.html',
  styleUrl: './draw-screen.component.css'
  // encapsulation: ViewEncapsulation.None
})

export class DrawScreenComponent {
  title = 'crow-modeler';
  events: string[] = [];
  opened: boolean = true;

  public selectedNode = null;

  text: string = 'color here';

  // WIP not working dialog
  constructor(public dialog: MatDialog) {}

  // Dialog window - to be deprecated if palette is accepted
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateClassDialogComponent, {
      width: '850px',
      data: {value1: '', value2: '', checkboxValue: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Create GoJS diagram node group here
        console.log(result);
      }
    });
  } // WIP not working dialog END


  // Development Model
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
        { name: 'ProductPhoto', iskey: false, figure: 'TriangleUp', color: 'red' },
      ],
      inheritedItems: [
        { name: 'SupplierID', iskey: false, figure: 'Decision', color: 'purple' },
        { name: 'CategoryID', iskey: false, figure: 'Decision', color: 'purple' },
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
        { name: 'CategoryID', iskey: false, figure: 'Decision', color: 'purple' },
      ]
    }
  ]

  linkDataArray = [
    { from: 'Produkt', to: 'Kategorie', fromArrow: "BackwardFork", toArrow: "Fork"}
  ]

  
  // nodeDataArray = [
  //   { key: 'Class1', color: 'red', isGroup: true},
  //   { key: 'Name', color: 'lightgreen', group: 'Class1' },
  //   { key: 'Attributes1', color: 'lightgreen', isGroup: true, group: 'Class1'},
  //   { key: 'Attribute 1', color: 'lightgreen', group: 'Attributes1' },
  //   { key: 'Attribute 2', color: 'lightgreen', group: 'Attributes1' },
  //   { key: 'Class2', color: 'blue', isGroup: true},
  //   { key: 'Name', color: 'lime', group: 'Class2' },
  //   { key: 'Attributes2', color: 'lightgreen', isGroup: true, group: 'Class2'},
  //   { key: 'Attribute 1', color: 'lightgreen', group: 'Attributes2' },
  //   { key: 'Attribute 2', color: 'lightgreen', group: 'Attributes2' },
  //   { key: 'Attribute 3', color: 'lightgreen', group: 'Attributes2' },
  //   { key: 'Attribute 4', color: 'lightgreen', group: 'Attributes2' }
  // ]

  // linkDataArray = [
  //   { from: 'Class1', to: 'Class1', toArrow: "Line Fork"},
  //   { from: 'Class1', to: 'Class2', toArrow: "Line Fork"}
  // ]

  public model: go.GraphLinksModel = new go.GraphLinksModel(
    {
      copiesArrays: true,
      copiesArrayObjects: true,
      nodeDataArray: this.nodeDataArray,
      linkDataArray: this.linkDataArray
    }
    
  );

  public setSelectedNode(node: any) {
    this.selectedNode = node;
  }

  public createClass() {
    this.model.startTransaction("make new node");
    this.model.addNodeData({ key: 'Zulieferer',
      className: 'Zulieferer',
      location: new go.Point(0, 15),
      items: [
        { name: 'SupplierID', iskey: true, figure: 'Decision', color: 'purple' },
        { name: 'SupplierName', iskey: false, figure: 'Hexagon', color: 'blue' },
        { name: 'Description', iskey: false, figure: 'Hexagon', color: 'blue' }
      ],
      inheritedItems: [
        { name: 'SupplierID', iskey: false, figure: 'Decision', color: 'purple' },
        { name: 'CategoryID', iskey: false, figure: 'Decision', color: 'purple' },
      ]});
    //this.model.addLinkData({ from: 'Kategorie', to: 'Zulieferer', fromArrow: "BackwardCircleFork", toArrow: "CircleFork"});
    this.model.commitTransaction("make new node");
  }

  // public createClass() {
  //   this.model.startTransaction("make new node");
  //   this.model.addNodeData({ key: 'Class3', isGroup: true});
  //   this.model.addNodeData({ key: 'Attributes3', color: 'lightgreen', isGroup: true, group: 'Class3'});
  //   this.model.addNodeData({ key: 'Attribute 1', color: 'lightgreen', group: 'Attributes3' });
  //   this.model.addNodeData({ key: 'Attribute 2', color: 'lightgreen', group: 'Attributes3' });
  //   this.model.addLinkData({ from: 'Class1', to: 'Class3', toArrow: "Line Fork"});
  //   this.model.commitTransaction("make new node");
  // }
  
  toJson(){
    console.log(this.model.toJson())
  }

  onButtonClick() {
    console.log('Button clicked!');
    // Hier kannst du deine spezifische Logik hinzufügen
  }
}

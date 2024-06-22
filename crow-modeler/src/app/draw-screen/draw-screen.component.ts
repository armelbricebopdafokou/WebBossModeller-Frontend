import { Component } from '@angular/core';
import { GojsAngularModule } from 'gojs-angular';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip'; // Hinzufügen des Tooltip-Moduls
import { GojsDiagramComponent } from '../gojs-diagram/gojs-diagram.component';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { SideComponent } from '../side/side.component';
import { InspectorComponent } from '../inspector/inspector.component';


import * as go from 'gojs';
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

  // Development Model
  public model: go.GraphLinksModel = new go.GraphLinksModel(
    [
      { key: 'Class1', isGroup: true},
      { key: 'Name', color: 'lightgreen', group: 'Class1' },
      { key: 'Attributes1', color: 'lightgreen', isGroup: true, group: 'Class1'},
      { key: 'Attribute 1', color: 'lightgreen', group: 'Attributes1' },
      { key: 'Attribute 2', color: 'lightgreen', group: 'Attributes1' },
      { key: 'Class2', isGroup: true},
      { key: 'Name', color: 'lightgreen', group: 'Class2' },
      { key: 'Attributes2', color: 'lightgreen', isGroup: true, group: 'Class2'},
      { key: 'Attribute 1', color: 'lightgreen', group: 'Attributes2' },
      { key: 'Attribute 2', color: 'lightgreen', group: 'Attributes2' },
      { key: 'Attribute 3', color: 'lightgreen', group: 'Attributes2' },
      { key: 'Attribute 4', color: 'lightgreen', group: 'Attributes2' }
    ],
    [
      { from: 'Class1', to: 'Class1', toArrow: "Line Fork"},
      { from: 'Class1', to: 'Class2', toArrow: "Line Fork"}
    ]
  );

  // public setSelectedNode(node: null) {
  //   this.selectedNode = node;
  // }

  public createClass() {
    this.model.startTransaction("make new node");
    this.model.addNodeData({ key: 'Class3', isGroup: true});
    this.model.addNodeData({ key: 'Attributes3', color: 'lightgreen', isGroup: true, group: 'Class3'});
    this.model.addNodeData({ key: 'Attribute 1', color: 'lightgreen', group: 'Attributes3' });
    this.model.addNodeData({ key: 'Attribute 2', color: 'lightgreen', group: 'Attributes3' });
    this.model.addLinkData({ from: 'Class1', to: 'Class3', toArrow: "Line Fork"});
    this.model.commitTransaction("make new node");
  }
  
  toJson(){
    console.log(this.model.toJson())
  }

  onButtonClick() {
    console.log('Button clicked!');
    // Hier kannst du deine spezifische Logik hinzufügen
  }
}

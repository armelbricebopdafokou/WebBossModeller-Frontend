import { Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import * as go from 'gojs';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-gojs-diagram',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './gojs-diagram.component.html',
  styleUrls: ['./gojs-diagram.component.css']
})

export class GojsDiagramComponent implements OnInit {
  @ViewChild('diagramDiv', { static: true }) diagramDiv!: ElementRef;

  public diagram!: go.Diagram;

  @Input()
  public model!: go.Model;

  @Output()
  public nodeClicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    // this.initDiagram();
  }

  ngAfterViewInit() {
    this.diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      initialContentAlignment: go.Spot.Center,
      'undoManager.isEnabled': true
    });

    // model aus dem Input decorator
    this.diagram.model = this.model;

    this.diagram.addDiagramListener('ChangedSelection', (e) => {
      const node = this.diagram.selection.first();
      this.nodeClicked.emit(node);
    });
    this.initDiagram();
  }



  initDiagram(): void {

    const $ = go.GraphObject.make;

    // const diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
    //   initialContentAlignment: go.Spot.Center,
    //   'undoManager.isEnabled': true
    // });

    this.diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0 },
          new go.Binding('fill', 'color')),
        $(go.TextBlock,
          { margin: 5, editable: false },
          new go.Binding('text', 'key'))
      );

    this.diagram.groupTemplate =
      $(go.Group, "Vertical",
        $(go.Panel, "Auto",
          $(go.Shape, "RoundedRectangle",  // surrounds the Placeholder
            {
              parameter1: 14,
              fill: "rgba(128,128,128,0.33)"
            }),
          $(go.Placeholder,    // represents the area of all member parts,
            { padding: 5 })  // with some extra padding around them
        ),
        $(go.TextBlock,         // group title
          { alignment: go.Spot.Right, font: "Bold 12pt Sans-Serif" },
          new go.Binding("text", "key"))
      );

    this.diagram.linkTemplate =
      new go.Link()
        .add(
          new go.Shape({ strokeWidth: 1, stroke: 'grey' }),
          new go.Shape({ toArrow: "Fork" }),
          new go.Shape({ fromArrow: "BackwardFork" })
        );

    //     diagram.model = new go.GraphLinksModel(
    //       [
    //         { key: 'Alpha', color: 'lightgreen' },
    //         { key: 'Beta', color: 'lightgreen' },
    //         { key: 'Gamma', color: 'lightgreen' },
    //         { key: 'Delta', color: 'lightgreen' },
    //         { key: 'Class1', isGroup: true},
    //         { key: 'Name', color: 'lightgreen', group: 'Class1' },
    //         { key: 'Attributes', color: 'lightgreen', isGroup: true, group: 'Class1'},
    //         { key: 'Attribute 1', color: 'lightgreen', group: 'Attributes' },
    //         { key: 'Attribute 2', color: 'lightgreen', group: 'Attributes' }
    //       ],
    //       [
    //         { from: 'Alpha', to: 'Beta' },
    //         { from: 'Alpha', to: 'Gamma' },
    //         { from: 'Beta', to: 'Beta' },
    //         { from: 'Gamma', to: 'Delta' },
    //         { from: 'Delta', to: 'Alpha' },
    //         { from: 'Alpha', to: 'Class1', toArrow: "Line Fork"}
    //       ]
    // );
  }

  getTime(): number {
    return new Date().getTime();
  }

  createClassNode(): void {
    alert(this.getTime());
    // diagram.startTransaction("addNode");
    // var node = {
    //     key: "newNode",
    //     text: "New Node",
    //     color: "lightblue",
    //     loc: "100 100"
    // };
    // diagram.model.addNodeData(node);
    // diagram.commitTransaction("addNode");
  }
}
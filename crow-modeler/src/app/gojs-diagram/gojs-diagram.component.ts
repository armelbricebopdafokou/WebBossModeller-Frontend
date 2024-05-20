import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-gojs-diagram',
  standalone: true,
  templateUrl: './gojs-diagram.component.html',
  styleUrls: ['./gojs-diagram.component.css']
})

export class GojsDiagramComponent implements OnInit {
  @ViewChild('diagramDiv', { static: true }) diagramDiv!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.initDiagram();
  }

  initDiagram(): void {
    const $ = go.GraphObject.make;

    const colors = {
      gold: '#f3e601',
      white: '#FFFFFF',
      black: '#101920',
    };

    const diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      initialContentAlignment: go.Spot.Center,
      'undoManager.isEnabled': true
    });

    diagram.nodeTemplate = $(
      go.Node,
      'Auto',
      $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 },
        new go.Binding('fill', 'color')),
      $(go.TextBlock,
        { margin: 8, editable: true },
        new go.Binding('text', 'key'))
    );

    diagram.groupTemplate =
    $(go.Group, "Vertical",
      $(go.Panel, "Auto",
        $(go.Shape, "RoundedRectangle",  // surrounds the Placeholder
          { parameter1: 14,
            fill: "rgba(128,128,128,0.33)" }),
        $(go.Placeholder,    // represents the area of all member parts,
          { padding: 5})  // with some extra padding around them
      ),
      $(go.TextBlock,         // group title
        { alignment: go.Spot.Right, font: "Bold 12pt Sans-Serif" },
        new go.Binding("text", "key"))
    );

    // diagram.linkTemplate =
    // $(go.Link,
    //   { toArrow: "Standard" }, // Set the default toArrow for all Links
    //   $(go.Shape),
    //   $(go.Shape, { toArrow: "Standard" }) // This shape will have the same toArrow as the Link
    // );

    // diagram.linkTemplate = new go.Link()
    // .add(
    //   new go.Shape(),                           // this is the link shape (the line)
    //   new go.Shape({ toArrow: "Line Fork" }),  // this is an arrowhead
    //   new go.TextBlock()                        // this is a Link label
    //     .bind("text")
    // );

    // diagram.linkTemplate = new go.Link({
    //   // // the whole link panel
    //   // routing: go.Routing.Normal,
    //   // // define a tooltip for each link that displays its information
    //   // toolTip: go.GraphObject.build('ToolTip').add(new go.TextBlock({ margin: 4 }).bindObject('text', '', infoString)),
    // })
    //   // the link shape
    //   // the first element in a Link is assumed to be main element
    //   .add(new go.Shape({ stroke: colors.white, strokeWidth: 1.5, strokeDashArray: [2, 5] }))
    //   // the "from" arrowhead
    //   .add(new go.Shape({ scale: 2, stroke: colors.white, fill: colors.black }).bind('fromArrow'))
    //   // the "to" arrowhead
    //   .add(new go.Shape({ scale: 2, stroke: colors.white, fill: colors.black }).bind('toArrow'));

    diagram.model = new go.GraphLinksModel(
      [
        { key: 'Alpha', color: 'lightgreen' },
        { key: 'Beta', color: 'lightgreen' },
        { key: 'Gamma', color: 'lightgreen' },
        { key: 'Delta', color: 'lightgreen' },
        { key: 'Class1', isGroup: true},
        { key: 'Name', color: 'lightgreen', group: 'Class1' },
        { key: 'Attributes', color: 'lightgreen', isGroup: true, group: 'Class1'},
        { key: 'Attribute 1', color: 'lightgreen', group: 'Attributes' },
        { key: 'Attribute 2', color: 'lightgreen', group: 'Attributes' }
      ],
      [
        { from: 'Alpha', to: 'Beta' },
        { from: 'Alpha', to: 'Gamma' },
        { from: 'Beta', to: 'Beta' },
        { from: 'Gamma', to: 'Delta' },
        { from: 'Delta', to: 'Alpha' },
        { from: 'Alpha', to: 'Class1', toArrow: "Line Fork"}
      ]
    );
  }
}
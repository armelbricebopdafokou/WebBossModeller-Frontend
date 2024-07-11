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
      //initialContentAlignment: go.Spot.Center,
      layout: $(go.ForceDirectedLayout),
      'draggingTool.dragsLink': true,
      'linkingTool.isUnconnectedLinkValid': true,
      'draggingTool.gridSnapCellSize': new go.Size(10,1),
      'draggingTool.isGridSnapEnabled': true,
      'undoManager.isEnabled': true,
    });

    // model aus dem Input decorator
    this.diagram.model = this.model;

    // Template für einzelne Attribute
    const itemTempl = $(go.Panel,
      'Horizontal',
      { margin: new go.Margin(2,0) },
      $(go.TextBlock,
        { font: '14px sans-serif', stroke: 'black', editable: true },
        new go.Binding('text', 'name'),
        new go.Binding('font', 'iskey', (k) => (k ? 'italic 14px sans-serif' : '14px sans-serif'))
      ),
      $('CheckBox', 'choice1',
        {
          alignment: go.Spot.Right
        }
      ) //for unique
    )

    this.diagram.nodeTemplate = 
    $(go.Node, 'Auto',
      {
        selectionAdorned: true,
        layoutConditions: go.LayoutConditions.Standard & ~go.LayoutConditions.NodeSized,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides
      },
      new go.Binding('location','location').makeTwoWay(),
      new go.Binding('desiredSize', 'visible', (v) => new go.Size(NaN,NaN)).ofObject('LIST'),
      $(go.Shape, 'Rectangle',
        {
          fill: 'lightgreen',
          portId: '',
          cursor: 'pointer', // the Shape is the port, not the whole Node
          // allow all kinds of links from and to this port
          fromLinkable: true,
          fromLinkableSelfNode: true,
          fromLinkableDuplicates: true,
          toLinkable: true,
          toLinkableSelfNode: true,
          toLinkableDuplicates: true,
        }
      ),
      $(go.Panel, 'Table',
        {
          margin: 8
        },
        $(go.RowColumnDefinition, { row: 0, sizing: go.Sizing.None}),
        $(go.TextBlock,
          {
            stroke: 'black',
            row: 0,
            alignment: go.Spot.Center,
            margin: new go.Margin(0, 24, 0, 2),
            font: 'bold 18px sans-serif',
            editable: true
          },
          new go.Binding('text', 'className')
        ),
        $('PanelExpanderButton', 'LIST', 
          {
            row:0, alignment: go.Spot.TopRight
          }
        ),
        $(go.Panel, 'Table',
          {
            name: 'LIST',
            row: 1
          },
          $(go.TextBlock, 'Attributes',
            {
              row: 0,
              margin: new go.Margin(3, 24, 3, 2)
            },
          ),
          $('PanelExpanderButton', 'NonInherited', {row: 0, alignment: go.Spot.Right}),
          $(go.Panel, 'Vertical',
            {
              row: 1, //Anordnung im Panel 'Label'
              name: 'NonInherited',
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.TopLeft,
              itemTemplate: itemTempl
            },
            new go.Binding('itemArray', 'items')
          )
        )
      )
      );

      this.diagram.linkTemplate = $(go.Link,
        {
          selectionAdorned:true,
          reshapable: true,
          routing: go.Routing.AvoidsNodes,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          relinkableFrom: true,
          relinkableTo: true,
        },
        $(go.Shape,{ strokeDashOffset: 1, strokeWidth: 2, stroke: 'grey' }),
        $(go.Shape, 
          {
            strokeWidth: 1.2,
            scale: 2,
            fill: 'white',
            toArrow: 'CircleFork'
          },
          new go.Binding('toArrow', 'toArrow')
        ),
        $(go.Shape, 
          {
            strokeWidth: 1.2,
            scale: 2,
            fill: 'white',
            fromArrow: 'BackwardCircleFork'
          },
          new go.Binding('fromArrow', 'fromArrow')
        )
      )

    this.diagram.addDiagramListener('ChangedSelection', (e) => {
      const node = this.diagram.selection.first();
      this.nodeClicked.emit(node);
    });

    //this.initDiagram();
  }



  initDiagram(): void {

    // const diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
    //   initialContentAlignment: go.Spot.Center,
    //   'undoManager.isEnabled': true
    // });

    // this.diagram.nodeTemplate =
    //   $(go.Node, "Auto",
    //     $(go.Panel, 'Auto',
    //       $(go.Shape, "Rectangle", { strokeWidth: 0 },
    //         new go.Binding('fill', 'color')),
    //       $(go.TextBlock,
    //         { 
    //           margin: 5, 
    //           editable: true 
    //         },
    //         new go.Binding('text', 'key'))
    //       )
    //   );

    // this.diagram.groupTemplate =
    //   $(go.Group, "Vertical", 
    //     {
    //       fromSpot: go.Spot.AllSides,
    //       toSpot: go.Spot.AllSides
    //     },
    //     $(go.TextBlock,         // group title
    //       {
    //         alignment: go.Spot.Left,
    //         font: "Bold 12pt Sans-Serif"
    //       },
    //       new go.Binding("text", "key")),
    //     $(go.Panel, "Auto",
    //       $(go.Shape, "Rectangle",  // surrounds the Placeholder
    //         {
    //           parameter1: 14,
    //           fill: "rgba(128,128,128,0.33)",
    //           fromLinkable: true,
    //           toLinkable: true
    //         }),
    //       $(go.Placeholder,    // represents the area of all member parts,
    //         { padding: 5 })  // with some extra padding around them
    //     )
    //   );

    // this.diagram.linkTemplate =
    //   new go.Link({
    //     routing: go.Routing.AvoidsNodes,
    //     reshapable: true,
    //     resegmentable: true,
    //     relinkableFrom: true,
    //     relinkableTo: true,
    //     fromSpot: go.Spot.AllSides,
    //     toSpot: go.Spot.AllSides
    //   })
    //     .add(
    //       new go.Shape({ strokeDashOffset: 1, strokeWidth: 1, stroke: 'grey' }),
    //       new go.Shape({ toArrow: "Fork" }),
    //       new go.Shape({ fromArrow: "BackwardFork" })
    //     ).bindTwoWay('points')
    //     ;

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
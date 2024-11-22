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
  public myPalette!: go.Palette;

  @Input() public model!: go.GraphLinksModel;
  @Output() public nodeClicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    // Diagram-Initialisierung
    this.diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      layout: $(go.GridLayout, { wrappingColumn: 3, spacing: new go.Size(20, 20) }),
      'draggingTool.dragsLink': true,
      'linkingTool.isUnconnectedLinkValid': true,
      'draggingTool.gridSnapCellSize': new go.Size(10, 1),
      'draggingTool.isGridSnapEnabled': true,
      'undoManager.isEnabled': true,
      autoScale: go.Diagram.Uniform
    });

    this.diagram.model = this.model;

    // Node Template
    const itemTempl = $(go.Panel, 'Horizontal',
      { margin: new go.Margin(2, 0), background: "transparent", click: (e, obj) => e.diagram.select(obj.part) },
      $(go.TextBlock,
        { font: '14px sans-serif', stroke: 'black', editable: true, isUnderline: false },
        new go.Binding('text', 'name'),
        new go.Binding('font', 'choice1', k => (k ? 'italic 14px sans-serif' : '14px sans-serif')),
        new go.Binding('isUnderline', 'choice1', k => !!k)
      ),
      {
        contextMenu: $(go.Adornment, 'Vertical',
          $('ContextMenuButton', $(go.TextBlock, 'Make Primary Key'), {
            click: (e, obj) => this.toggleProperty(obj, 'isKey')
          }),
          $('ContextMenuButton', $(go.TextBlock, 'Set Unique'), {
            click: (e, obj) => this.toggleProperty(obj, 'isUnique')
          }),
          $('ContextMenuButton', $(go.TextBlock, 'Set Not Null'), {
            click: (e, obj) => this.toggleProperty(obj, 'isNotNull')
          })
        )
      },
      new go.Binding('background', 'isSelected', sel => sel ? 'lightblue' : 'transparent').ofObject()
    );

    // Diagram-Node-Template
    this.diagram.nodeTemplate = $(go.Node, 'Auto',
      {
        selectionAdorned: true,
        resizable: true,
        layoutConditions: go.LayoutConditions.Standard & ~go.LayoutConditions.NodeSized,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides
      },
      new go.Binding('location', 'location').makeTwoWay(),
      $(go.Shape, 'Rectangle',
        { fill: 'lightgreen', stroke: "black", strokeWidth: 2, portId: '', fromLinkable: true, toLinkable: true }
      ),
      $(go.Shape,
        { fill: null, stroke: "black", strokeWidth: 1.5 },
        new go.Binding("geometryString", "isWeak", weak =>
          weak ? "F M0 10 L10 0 H90 L100 10 V90 L90 100 H10 L0 90z" : null
        )
      ),
      $(go.Panel, 'Table', { padding: 4 },
        $(go.TextBlock, { row: 0, column: 0, columnSpan: 2, font: 'bold 16px sans-serif', editable: true, alignment: go.Spot.Center },
          new go.Binding('text', 'className')
        ),
        $(go.Shape, 'LineH', { row: 1, column: 0, columnSpan: 2, stroke: 'black', strokeWidth: 1 }),
        $(go.Panel, 'Vertical', { name: 'LIST', row: 2, column: 0, columnSpan: 2, alignment: go.Spot.TopLeft, itemTemplate: itemTempl },
          new go.Binding('itemArray', 'items')
        )
      )
    );

    // Diagram-Link-Template
    this.diagram.linkTemplate = $(go.Link,
      {
        selectionAdorned: false,
        reshapable: true,
        routing: go.Routing.AvoidsNodes,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        relinkableFrom: true,
        relinkableTo: true,
        contextMenu: $(go.Adornment, 'Vertical',
          $('ContextMenuButton', $(go.TextBlock, "Toggle Link Weak"), {
            click: (e, obj) => this.toggleLinkWeakness(obj)
          })
        )
      },
      $(go.Shape, { strokeWidth: 2, strokeDashArray: [8, 0], stroke: 'grey' },
        new go.Binding('strokeDashArray', 'weak', k => (k ? [8, 2] : [8, 0]))
      ),
      $(go.Shape, { strokeWidth: 1.2, scale: 2, fill: 'white', toArrow: 'Standard' },
        new go.Binding('toArrow', 'toArrow')
      ),
      $(go.Shape, { strokeWidth: 1.2, scale: 2, fill: 'white', fromArrow: 'BackwardFork' },
        new go.Binding('fromArrow', 'fromArrow')
      )
    );

    // Palette-Initialisierung
    this.myPalette = new go.Palette('myPaletteDiv', {
      nodeTemplate: this.diagram.nodeTemplate,
      contentAlignment: go.Spot.Center,
      layout: $(go.GridLayout, { wrappingColumn: 1, cellSize: new go.Size(2, 2) })
    });

    this.myPalette.model.nodeDataArray = [
      {
        key: 'ClassKey',
        className: 'Name',
        location: new go.Point(0, 0),
        items: [{ name: 'NameID', iskey: true }, { name: 'AnotherAttribute', iskey: false }]
      },
      {
        key: 'WeakClassKey',
        className: 'Weak Name',
        location: new go.Point(0, 0),
        items: [{ name: 'NameID', iskey: true }, { name: 'AnotherAttribute', iskey: false }],
        isWeak: true
      }
    ];

    // Auswahländerungslistener
    this.diagram.addDiagramListener('ChangedSelection', e => {
      const node = this.diagram.selection.first();
      if (node instanceof go.Node) this.nodeClicked.emit(node);
    });

    // Layout erzwingen
    this.diagram.layoutDiagram(true);
  }

  toggleProperty(obj: go.GraphObject, property: string) {
    const contextItem = obj.part;
    if (contextItem?.data) {
      const itemData = contextItem.data;
      itemData[property] = !itemData[property];
      this.diagram.model.updateTargetBindings(itemData);
    }
  }

  toggleLinkWeakness(obj: go.GraphObject) {
    const linkData = obj.part?.data;
    if (linkData) {
      this.diagram.model.startTransaction('Toggle link weakness');
      this.diagram.model.setDataProperty(linkData, 'weak', !linkData.weak);
      this.diagram.model.commitTransaction('Toggle link weakness');
    }
  }

  zoomIn() {
    this.diagram?.commandHandler.increaseZoom();
  }

  zoomOut() {
    this.diagram?.commandHandler.decreaseZoom();
  }
}

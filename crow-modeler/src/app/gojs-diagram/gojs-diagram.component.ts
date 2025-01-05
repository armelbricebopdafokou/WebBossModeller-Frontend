import { Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as go from 'gojs';
import { DrawingModeService } from '../drawing-mode.service';
import { EditNodeDialogComponent } from '../edit-node-dialog/edit-node-dialog.component';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-gojs-diagram',
  standalone: true,
  templateUrl: './gojs-diagram.component.html',
  styleUrls: ['./gojs-diagram.component.css']
})
export class GojsDiagramComponent implements OnInit {
  @ViewChild('diagramDiv', { static: true }) diagramDiv!: ElementRef;
  @ViewChild('paletteDiv', { static: true }) paletteDiv!: ElementRef;
  public diagram!: go.Diagram;
  public palette!: go.Palette;

  @Input() public model!: go.GraphLinksModel;
  @Output() public nodeClicked = new EventEmitter();
  isAdvancedMode!: boolean;

  constructor(public dialog: MatDialog, private modeService: DrawingModeService) { }

  ngOnInit(): void {
    this.modeService.currentMode.subscribe(mode => {
      this.isAdvancedMode = mode;
    });
  }

  ngAfterViewInit() {
    // Diagram initialisieren
    this.diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      'undoManager.isEnabled': true,
    });

    // NodeTemplate für normale Entitäten
    this.diagram.nodeTemplate = $(go.Node, 'Auto',
      {
        selectionAdorned: true,
        resizable: true,
        resizeObjectName: 'TABLE',
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        portId: '',
        contextMenu: $(go.Adornment, 'Vertical',
          $('ContextMenuButton',
            $(go.TextBlock, 'Bearbeiten'),
            { click: (e, obj) => this.openEditDialog(obj) }
          ),
          $('ContextMenuButton',
            $(go.TextBlock, 'Löschen'),
            { click: (e, obj) => this.deleteNode(obj) }
          )
        )
      },
      $(go.Shape, 'Rectangle', { fill: 'white', stroke: 'black', strokeWidth: 1 }),
      $(go.Panel, 'Table',
        { name: 'TABLE', stretch: go.GraphObject.Fill },
        $(go.Panel, 'Auto',
          { row: 0, stretch: go.GraphObject.Horizontal },
          $(go.Shape, 'Rectangle', { fill: 'gray', stroke: null }),
          $(go.TextBlock,
            {
              margin: 5,
              font: 'bold 12px sans-serif',
              stroke: 'white',
              textAlign: 'center',
              editable: true
            },
            new go.Binding('text', 'name').makeTwoWay()
          )
        ),
        $(go.Panel, 'Vertical',
          { row: 1, stretch: go.GraphObject.Fill },
          $(go.Panel, 'Table',
            new go.Binding('itemArray', 'attributes'),
            {
              itemTemplate: $(
                go.Panel, 'TableRow',
                $(go.TextBlock,
                  { margin: 5, column: 0, editable: true },
                  new go.Binding('text', 'name').makeTwoWay()
                )
              )
            }
          )
        )
      )
    );

    // NodeTemplate für schwache Entitäten
    this.diagram.nodeTemplateMap.add('WeakEntity',
      $(go.Node, 'Auto',
        {
          selectionAdorned: true,
          resizable: true,
          resizeObjectName: 'TABLE',
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          portId: '',
          contextMenu: $(go.Adornment, 'Vertical',
            $('ContextMenuButton',
              $(go.TextBlock, 'Bearbeiten'),
              { click: (e, obj) => this.openEditDialog(obj) }
            ),
            $('ContextMenuButton',
              $(go.TextBlock, 'Löschen'),
              { click: (e, obj) => this.deleteNode(obj) }
            )
          )
        },
        $(go.Shape, 'Rectangle', { fill: 'white', stroke: 'black', strokeWidth: 2, strokeDashArray: [4, 2] }),
        $(go.Panel, 'Table',
          { name: 'TABLE', stretch: go.GraphObject.Fill },
          $(go.Panel, 'Auto',
            { row: 0, stretch: go.GraphObject.Horizontal },
            $(go.Shape, 'Rectangle', { fill: 'lightgray', stroke: null }),
            $(go.TextBlock,
              {
                margin: 5,
                font: 'bold 12px sans-serif',
                stroke: 'black',
                textAlign: 'center',
                editable: true
              },
              new go.Binding('text', 'name').makeTwoWay()
            )
          ),
          $(go.Panel, 'Vertical',
            { row: 1, stretch: go.GraphObject.Fill },
            $(go.Panel, 'Table',
              new go.Binding('itemArray', 'attributes'),
              {
                itemTemplate: $(
                  go.Panel, 'TableRow',
                  $(go.TextBlock,
                    {
                      margin: 5,
                      column: 0,
                      editable: true,
                      stroke: 'blue'
                    },
                    new go.Binding('text', 'name').makeTwoWay()
                  )
                )
              }
            )
          )
        )
      )
    );

    // LinkTemplate für Beziehungen
    this.diagram.linkTemplate = $(go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 5,
        relinkableFrom: true,
        relinkableTo: true
      },
      $(go.Shape, { strokeWidth: 2 }),
      $(go.TextBlock,
        {
          segmentOffset: new go.Point(0, -10),
          editable: true
        },
        new go.Binding('text', 'label').makeTwoWay()
      ),
      $(go.TextBlock,
        {
          segmentOffset: new go.Point(-20, 10),
          editable: true
        },
        new go.Binding('text', 'fromCardinality').makeTwoWay()
      ),
      $(go.TextBlock,
        {
          segmentOffset: new go.Point(20, 10),
          editable: true
        },
        new go.Binding('text', 'toCardinality').makeTwoWay()
      )
    );

    // Palette initialisieren
    this.palette = $(go.Palette, this.paletteDiv.nativeElement,
      {
        nodeTemplateMap: this.diagram.nodeTemplateMap,
        model: new go.GraphLinksModel([
          {
            category: 'WeakEntity',
            name: 'Schwache Entität',
            attributes: [
              { name: 'Fremdschlüssel1', isForeignKey: true },
              { name: 'Fremdschlüssel2', isForeignKey: true }
            ]
          },
          {
            key: 'PaletteNode',
            name: 'Normale Entität',
            attributes: [
              { name: 'id' },
              { name: 'name' }
            ]
          }
        ])
      });

    // Modell-Daten
    this.diagram.model = new go.GraphLinksModel(
      [
        {
          key: 1,
          name: 'Kunde',
          attributes: [
            { name: 'KundenID' },
            { name: 'Name' },
            { name: 'Adresse' }
          ]
        },
        {
          key: 2,
          category: 'WeakEntity',
          name: 'Bestellposition',
          attributes: [
            { name: 'BestellID', isForeignKey: true },
            { name: 'ProduktID', isForeignKey: true },
            { name: 'Menge' }
          ]
        }
      ],
      [
        { from: 1, to: 2, label: 'besteht aus', fromCardinality: '1', toCardinality: 'n' }
      ]
    );
  }

  addNodeFromContext(obj: go.GraphObject) {
    const newNode = {
      key: this.diagram.model.nodeDataArray.length + 1,
      name: 'Neue Entität',
      attributes: [
        { name: 'id' },
        { name: 'name' }
      ]
    };

    this.diagram.startTransaction('add node');
    this.diagram.model.addNodeData(newNode);
    this.diagram.commitTransaction('add node');
  }

  addWeakNode() {
    const newWeakNode = {
      key: this.diagram.model.nodeDataArray.length + 1,
      category: 'WeakEntity',
      name: 'Schwache Entität',
      attributes: [
        { name: 'Fremdschlüssel1', isForeignKey: true },
        { name: 'Fremdschlüssel2', isForeignKey: true },
        { name: 'Attribut' }
      ]
    };

    this.diagram.startTransaction('add weak node');
    this.diagram.model.addNodeData(newWeakNode);
    this.diagram.commitTransaction('add weak node');
  }

  openEditDialog(obj: go.GraphObject) {
    const contextItem = obj.part;
    if (contextItem?.data) {
      const dialogRef = this.dialog.open(EditNodeDialogComponent, {
        width: '300px',
        data: { name: contextItem.data.name, attributes: contextItem.data.attributes }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.diagram.startTransaction('update node data');
          this.diagram.model.assignAllDataProperties(contextItem.data, result);
          this.diagram.updateAllTargetBindings();
          this.diagram.commitTransaction('update node data');
        }
      });
    }
  }

  deleteNode(obj: go.GraphObject) {
    const node = obj.part;
    if (node) {
      this.diagram.startTransaction('delete node');
      this.diagram.model.removeNodeData(node.data);
      this.diagram.commitTransaction('delete node');
    }
  }
}

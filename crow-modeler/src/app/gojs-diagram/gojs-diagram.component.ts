import { Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditNodeDialogComponent } from '../edit-node-dialog/edit-node-dialog.component';
import * as go from 'gojs';

import { DrawingModeService } from '../drawing-mode.service';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-gojs-diagram',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, EditNodeDialogComponent],
  templateUrl: './gojs-diagram.component.html',
  styleUrls: ['./gojs-diagram.component.css']
})
export class GojsDiagramComponent implements OnInit {
  @ViewChild('diagramDiv', { static: true }) diagramDiv!: ElementRef;
  public diagram!: go.Diagram;
  public myPalette!: go.Palette;

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
    // Diagram-Initialisierung
    this.diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      'draggingTool.dragsLink': true,
      'linkingTool.isUnconnectedLinkValid': false,
      'draggingTool.gridSnapCellSize': new go.Size(10, 1),
      'draggingTool.isGridSnapEnabled': true,
      'undoManager.isEnabled': true,
    });

    this.diagram.model = this.model;

    // Define the template for nodes in the diagram
    this.diagram.nodeTemplate =
      $(go.Node, 'Spot',
        {
          selectionAdorned: true,
          resizable: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          contextMenu: $(go.Adornment, 'Vertical',
            $('ContextMenuButton', $(go.TextBlock, 'Bearbeiten'), {
              click: (e, obj) => {
                this.openEditDialog(obj);
              }
            }),
            $('ContextMenuButton', $(go.TextBlock, 'Löschen'), {
              click: (e, obj) => {
                this.deleteNode(obj);
              }
            }),
          )
        },
        new go.Binding('location', 'location').makeTwoWay(),

        // Outer frame of the table
        $(go.Shape, 'Rectangle',
          {
            fill: 'lightgreen',
            stroke: "black",
            strokeWidth: 2,
            portId: '',
            cursor: 'grab',
            fromLinkable: true,
            toLinkable: true,
            alignment: go.Spot.Center,
            stretch: go.Stretch.Fill
          },
          new go.Binding('fill', 'color')
        ),

        // Inner text block
        $(go.TextBlock,
          {
            font: 'bold 14px sans-serif',
            margin: 5,
            editable: true, // Ermöglicht die Bearbeitung des Textes direkt im Diagramm
            textAlign: 'center'
          },
          new go.Binding('text', 'name').makeTwoWay() // Bindung für den Text
        )
      );

    // Palette-Initialisierung
    this.myPalette = $(go.Palette, 'myPaletteDiv', {
      nodeTemplate: this.diagram.nodeTemplate,
      model: new go.GraphLinksModel([
        { key: 1, name: 'Node 1', color: 'lightblue' },
        { key: 2, name: 'Node 2', color: 'lightgreen' }
      ])
    });
  }

  // Methode zum Öffnen des Editierdialogs
  openEditDialog(obj: go.GraphObject) {
    const contextItem = obj.part;
    if (contextItem?.data) {
      const dialogRef = this.dialog.open(EditNodeDialogComponent, {
        width: '400px',
        data: { ...contextItem.data } // Übergeben der aktuellen Knotendaten
      });

      dialogRef.afterClosed().subscribe((result: go.ObjectData) => {
        if (result) {
          this.diagram.startTransaction('update node data');
          this.diagram.model.assignAllDataProperties(contextItem.data, result);
          this.diagram.commitTransaction('update node data');
        }
      });
    }
  }

  deleteNode(obj: go.GraphObject) {
    const node = obj.part;
    if (node) {
      this.diagram.model.removeNodeData(node.data);
    }
  }
}

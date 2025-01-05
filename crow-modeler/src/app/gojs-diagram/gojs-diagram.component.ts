import { Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import * as go from 'gojs';
import { DrawingModeService } from '../drawing-mode.service';
import { EditNodeDialogComponent } from '../edit-node-dialog/edit-node-dialog.component';

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
    // Diagram initialisieren
    this.diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      'undoManager.isEnabled': true,
    });

    this.diagram.model = this.model;

    // NodeTemplate mit Kontextmenü definieren
    this.diagram.nodeTemplate = $(go.Node, 'Spot',
      {
        contextMenu: $(go.Adornment, 'Vertical',
          $('ContextMenuButton', $(go.TextBlock, 'Bearbeiten'), {
            click: (e, obj) => this.openEditDialog(obj)
          }),
          $('ContextMenuButton', $(go.TextBlock, 'Löschen'), {
            click: (e, obj) => this.deleteNode(obj)
          })
        )
      },
      $(go.Shape, 'Rectangle',
        { fill: 'lightgreen', strokeWidth: 2 },
        new go.Binding('fill', 'color')
      ),
      $(go.TextBlock,
        { margin: 5, editable: true },
        new go.Binding('text', 'name').makeTwoWay()
      )
    );

    // Palette initialisieren
    this.myPalette = $(go.Palette, 'myPaletteDiv', {
      nodeTemplate: this.diagram.nodeTemplate,
      model: new go.GraphLinksModel([
        { key: 1, name: 'Node 1', color: 'lightblue' },
        { key: 2, name: 'Node 2', color: 'lightgreen' },
        { key: 3, name: 'Node 3', color: 'lightyellow' }
      ])
    });
  }

  // Bearbeiten-Funktion
  openEditDialog(obj: go.GraphObject) {
    const contextItem = obj.part; // Knoten, auf den das Kontextmenü angewendet wurde
    if (contextItem?.data) {
      // Öffne den Dialog mit direkten Knotendaten
      const dialogRef = this.dialog.open(EditNodeDialogComponent, {
        width: '400px',
        data: contextItem.data // Direkte Referenz der Daten übergeben
      });

      // Während der Eingabe: Änderungen sofort reflektieren
      dialogRef.componentInstance.data = contextItem.data;

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.diagram.startTransaction('update node data');
          this.diagram.model.assignAllDataProperties(contextItem.data, result); // Änderungen übernehmen
          this.diagram.updateAllTargetBindings(); // Aktualisiere alle Bindungen im Diagramm
          this.diagram.commitTransaction('update node data');
        }
      });
    }
  }

  // Löschen-Funktion
  deleteNode(obj: go.GraphObject) {
    const node = obj.part;
    if (node) {
      this.diagram.startTransaction('delete node');
      this.diagram.model.removeNodeData(node.data);
      this.diagram.commitTransaction('delete node');
    }
  }
}

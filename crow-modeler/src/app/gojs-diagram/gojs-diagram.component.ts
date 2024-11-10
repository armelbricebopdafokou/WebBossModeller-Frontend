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

  // Diagram-Objekt für GoJS-Diagramme
  public diagram!: go.Diagram;

  // Palette zum Drag & Drop von Knoten
  public myPalette!: go.Palette;

  // Input-Binding für das Modell des Diagramms
  @Input() public model!: go.Model;

  // Output-EventEmitter für Node-Klick-Ereignisse
  @Output() public nodeClicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    // Nothing to initialize here for now
  }

  ngAfterViewInit() {
    // Diagramm initialisieren
    this.diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      layout: $(go.ForceDirectedLayout), // Verwende ein force-directed Layout
      'draggingTool.dragsLink': true,
      'linkingTool.isUnconnectedLinkValid': true,
      'draggingTool.gridSnapCellSize': new go.Size(10, 1),
      'draggingTool.isGridSnapEnabled': true,
      'undoManager.isEnabled': true, // Ermöglicht Rückgängig- und Wiederherstellen-Funktionalität
    });

    // Modell vom Input-Dekorator setzen
    this.diagram.model = this.model;

    // Template für einzelne Attribute
    const itemTempl = $(go.Panel, 'Horizontal',
      {
        margin: new go.Margin(2, 0),
        // Standardfarbe für den Hintergrund und Click-Event für die Auswahl
        background: "transparent",
        click: (e, obj) => {
          e.diagram.select(obj.part); // Das ausgewählte Attribut aktivieren
        }
      },
      $(go.TextBlock,
        {
          font: '14px sans-serif',
          stroke: 'black',
          editable: true,
          isUnderline: false
        },
        new go.Binding('text', 'name'), // Datenbindung für den Text
        new go.Binding('font', 'choice1', (k) => (k ? 'italic 14px sans-serif' : '14px sans-serif')),
        new go.Binding('isUnderline', 'choice1', (k) => (k ? true : false)),
      ),
      {
        // Definiere das Kontextmenü für jedes Attribut-Element
        contextMenu: $(go.Adornment, 'Vertical',
          $('ContextMenuButton',
            $(go.TextBlock, 'Make Primary Key'),
            {
              click: (e, obj) => {
                const contextItem = obj.part;
                if (contextItem && contextItem.data) {
                  const itemData = contextItem.data;
                  itemData.isKey = !itemData.isKey;
                  e.diagram.model.updateTargetBindings(itemData);
                }
              }
            }
          ),
          $('ContextMenuButton',
            $(go.TextBlock, 'Set Unique'),
            {
              click: (e, obj) => {
                const contextItem = obj.part;
                if (contextItem && contextItem.data) {
                  const itemData = contextItem.data;
                  itemData.isUnique = !itemData.isUnique;
                  e.diagram.model.updateTargetBindings(itemData);
                }
              }
            }
          ),
          $('ContextMenuButton',
            $(go.TextBlock, 'Set Not Null'),
            {
              click: (e, obj) => {
                const contextItem = obj.part;
                if (contextItem && contextItem.data) {
                  const itemData = contextItem.data;
                  itemData.isNotNull = !itemData.isNotNull;
                  e.diagram.model.updateTargetBindings(itemData);
                }
              }
            }
          )
        )
      },
      // Setze die Hintergrundfarbe für ausgewählte Elemente
      new go.Binding("background", "isSelected", (sel) => sel ? "lightblue" : "transparent").ofObject()
    );



    // Definition der Knoten-Vorlage
    this.diagram.nodeTemplate =
      $(go.Node, 'Auto',
        {
          selectionAdorned: true, // Umrandung bei Auswahl anzeigen
          resizable: true, // Ermöglicht das Ändern der Knotengröße
          layoutConditions: go.LayoutConditions.Standard & ~go.LayoutConditions.NodeSized,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides
        },
        new go.Binding('location', 'location').makeTwoWay(), // Bindung für die Position des Knotens
        new go.Binding('desiredSize', 'visible', (v) => new go.Size(NaN, NaN)).ofObject('LIST'),
        $(go.Shape, 'Rectangle',
          {
            fill: 'lightgreen',
            portId: '',
            cursor: 'pointer',
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: true,
            toLinkableDuplicates: true,
          }
        ),


        $(go.Shape, 'XLine',
          {
            alignment: go.Spot.TopLeft,
            maxSize: new go.Size(20, 20),
            visible: false
          },
          new go.Binding('visible', 'isWeak', k => (k ? true : false)) // Geometrie für schwache Klassen
        ),







        $(go.Panel, 'Table',
          { margin: 16 },
          $(go.RowColumnDefinition, { row: 0, sizing: go.Sizing.None }),
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
            { row: 0, alignment: go.Spot.TopRight }
          ),
          new go.Shape('LineH',
            {
              row: 1,
              stroke: 'rgba(0, 0, 0, .60)',
              strokeWidth: 2,
              height: 1,
              stretch: go.Stretch.Horizontal
            }),
          $(go.Panel, 'Table',
            {
              name: 'LIST',
              row: 2
            },
            $(go.Panel, 'Horizontal',
              {
                row: 0,
                name: 'AttributeHeader'
              }
            ),
            $(go.Panel, 'Vertical',
              {
                row: 2,
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

    // Palette initialisieren für Drag & Drop von Klassen
    this.myPalette = new go.Palette('myPaletteDiv', {
      nodeTemplate: this.diagram.nodeTemplate,
      contentAlignment: go.Spot.Center,
      layout: $(go.GridLayout, { wrappingColumn: 1, cellSize: new go.Size(2, 2) }),
    });

    // Palette-Datenmodell definieren
    this.myPalette.model.nodeDataArray = [
      {
        key: 'ClassKey',
        className: 'Name',
        location: new go.Point(0, 0),
        items: [
          { name: 'NameID', iskey: true, figure: 'Decision', color: 'purple' },
          { name: '', iskey: false, figure: 'Hexagon', color: 'blue' }
        ],
        inheritedItems: []
      },
      {
        key: 'ClassKey',
        className: 'Weak Name',
        location: new go.Point(0, 0),
        items: [
          { name: 'NameID', iskey: true, figure: 'Decision', color: 'purple' },
          { name: '', iskey: false, figure: 'Hexagon', color: 'blue' }
        ],
        inheritedItems: [],
        isWeak: true
      }
    ];

    // Definition der Verbindungs-Vorlage
    this.diagram.linkTemplate = $(go.Link,
      {
        selectionAdorned: true,
        reshapable: true,
        routing: go.Routing.AvoidsNodes,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        relinkableFrom: true,
        relinkableTo: true,
      },
      $(go.Shape, { strokeDashOffset: 1, strokeWidth: 2, stroke: 'grey' }),
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
    );

    // Listener für die Auswahländerung hinzufügen
    this.diagram.addDiagramListener('ChangedSelection', (e) => {
      const node = this.diagram.selection.first();
      this.nodeClicked.emit(node);
    });
  }

  // Funktion, um die aktuelle Zeit zu erhalten
  getTime(): number {
    return new Date().getTime();
  }

  // Funktion zum Erstellen eines neuen Knoten
  createClassNode(): void {
    alert(this.getTime());
  }
}

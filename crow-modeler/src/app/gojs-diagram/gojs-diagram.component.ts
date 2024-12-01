import { Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import * as go from 'gojs';

import { DrawingModeService } from '../drawing-mode.service';

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
      //layout: $(go.GridLayout, { wrappingColumn: 3, spacing: new go.Size(20, 20) }),
      'draggingTool.dragsLink': true,
      'linkingTool.isUnconnectedLinkValid': false, // Links must be connected to two nodes
      'draggingTool.gridSnapCellSize': new go.Size(10, 1),
      'draggingTool.isGridSnapEnabled': true,
      'undoManager.isEnabled': true,
      // autoScale: go.Diagram.Uniform //This disables the zoom feature
    });

    this.diagram.model = this.model;

    // Attribute Item Template
    const itemTempl = $(go.Panel, 'Horizontal',
      { margin: new go.Margin(2, 0), background: "transparent", click: (e, obj) => e.diagram.select(obj.part) },
      $(go.TextBlock,
        { font: '14px sans-serif', stroke: 'black', editable: true, isUnderline: false },
        new go.Binding('text', 'name'),
        new go.Binding('font', 'choice1', k => (k ? 'italic 14px sans-serif' : '14px sans-serif')),
        new go.Binding('isUnderline', 'choice1', k => !!k)
      ),
      new go.Binding('background', 'isSelected', sel => sel ? 'lightblue' : 'transparent').ofObject()
    );

    // Define the template for nodes in the diagram
    this.diagram.nodeTemplate =
      $(go.Node, 'Auto',
        {
          selectionAdorned: true,
          resizable: true,
          layoutConditions: go.LayoutConditions.Standard & ~go.LayoutConditions.NodeSized,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides
        },
        {
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
            $('ContextMenuButton', $(go.TextBlock, 'Set No'), {
              click: (e, obj) => this.toggleProperty(obj, 'isNotNull')
            })
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
          new go.Binding('fill', 'color'),
          new go.Binding("geometryString", "isWeak", weak =>
            weak ? "F M0 10 L10 0 H90 L100 10 V90 L90 100 H10 L0 90z" : null
          )
        ),

        // Slanted shape for weak tables
        $(go.Shape,
          {
            fill: null,
            stroke: "black",
            strokeWidth: 1.5,
            //alignment: go.Spot.Center,
            stretch: go.Stretch.Fill
          },
          new go.Binding("geometryString", "isWeak", weak =>
            weak ? "F M0 10 L10 0 H90 L100 10 V90 L90 100 H10 L0 90z" : null
          )
        ),

        // Panel for attributes and header
        $(go.Panel, 'Table',
          { padding: 4 },

          // Header
          $(go.TextBlock,
            {
              row: 0,
              column: 0,
              columnSpan: 2,
              stroke: 'black',
              alignment: go.Spot.Center,
              editable: true,
              font: 'bold 16px sans-serif',
              margin: new go.Margin(2, 2, 2, 2)
            },
            new go.Binding('text', 'className')
          ),

          // Divider line under the header
          $(go.Shape, 'LineH',
            {
              row: 1,
              column: 0,
              columnSpan: 2,
              stroke: 'black',
              strokeWidth: 1,
              stretch: go.GraphObject.Horizontal,
              margin: new go.Margin(2, 2, 2, 2)
            }
          ),

          // List of attributes
          $(go.Panel, 'Vertical',
            {
              name: 'LIST',
              row: 2,
              column: 0,
              columnSpan: 2,
              alignment: go.Spot.TopLeft,
              itemTemplate: itemTempl
            },
            new go.Binding('itemArray', 'items')
          )
        )
      );

    // Diagram-Link-Template (redundant)
    // this.diagram.linkTemplate = $(go.Link,
    //   {
    //     selectionAdorned: false,
    //     reshapable: true,
    //     routing: go.Routing.AvoidsNodes,
    //     fromSpot: go.Spot.AllSides,
    //     toSpot: go.Spot.AllSides,
    //     relinkableFrom: true,
    //     relinkableTo: true,
    //     contextMenu: $(go.Adornment, 'Vertical',
    //       $('ContextMenuButton', $(go.TextBlock, "Toggle Link Weak"), {
    //         click: (e, obj) => this.toggleLinkWeakness(obj)
    //       })
    //     )
    //   },
    //   $(go.Shape, { strokeWidth: 2, strokeDashArray: [8, 0], stroke: 'grey' },
    //     new go.Binding('strokeDashArray', 'weak', k => (k ? [8, 2] : [8, 0]))
    //   ),
    //   $(go.Shape, { strokeWidth: 1.2, scale: 2, fill: 'white', toArrow: 'Standard' },
    //     new go.Binding('toArrow', 'toArrow')
    //   ),
    //   $(go.Shape, { strokeWidth: 1.2, scale: 2, fill: 'white', fromArrow: 'BackwardFork' },
    //     new go.Binding('fromArrow', 'fromArrow')
    //   )
    // );

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
      },
      {
        key: 'Commentary',
        className: 'Kommentar',
        items: [{ name: 'NameID', iskey: true }, { name: 'AnotherAttribute', iskey: false }],
        isWeak: false,
        color: 'yellow'
      }
    ];


    // Link template (the real one)
    this.diagram.linkTemplate = $(go.Link,
      {
        routing: go.Routing.AvoidsNodes,
        corner: 5,
        relinkableFrom: true,
        relinkableTo: true,
        selectable: true,
        reshapable: true,
        // },
        // new go.Binding("points").makeTwoWay(),
        selectionAdorned: false,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        fromShortLength: 100,
        toShortLength: 100,
        contextMenu: $(go.Adornment, 'Vertical',
          $('ContextMenuButton',
            $(go.TextBlock, "Toggle Link Weak"),
            {
              click: (e, obj) => {
                // Get the data of the link that was clicked
                const linkData = obj.part?.data;
                // Toggle the link data
                this.diagram.model.startTransaction('Toggle link weakness')
                this.diagram.model.setDataProperty(linkData, 'weak', !linkData.weak)
                this.diagram.model.commitTransaction('Toggle link weakness')
                console.log("Weak property of link toggled!")
                console.log("Link Data:", linkData);
                console.log("fromShortLength:", linkData.fromShortLength);
                console.log("toShortLength:", linkData.toShortLength);
              }
            }
          ),
          $('ContextMenuButton',
            $(go.TextBlock, "Toggle FromNode Anzahl"),
            {
              click: (e, obj) => {
                // Get the data of the link that was clicked
                const linkData = obj.part?.data;

                // Define a type for the possible arrow states
                type ArrowState = 'BackwardLineFork' | 'BackwardCircleFork' | 'DoubleLine' | 'LineCircle';

                // Define the mapping of current states to toggled states
                const arrowToggleMap: Record<ArrowState, ArrowState> = {
                  'BackwardLineFork': 'DoubleLine',
                  'BackwardCircleFork': 'LineCircle',
                  'DoubleLine': 'BackwardLineFork',
                  'LineCircle': 'BackwardCircleFork'
                };

                // Get the current fromArrow state and assert its type
                const currentArrow = linkData.fromArrow as ArrowState;
                let confirmed = true;

                if (true && currentArrow == 'DoubleLine') {
                  confirmed = window.confirm("Wirklich machen?")
                }

                if (confirmed) {

                  // Start a transaction to update the link
                  this.diagram.model.startTransaction('Toggle FromArrow');

                  console.log("Current Arrow = ", currentArrow)

                  // Determine the new state based on the current state
                  const newArrow = arrowToggleMap[currentArrow]; // This will be safe now

                  // Set the new fromArrow state
                  this.diagram.model.setDataProperty(linkData, 'fromArrow', newArrow);

                  // Commit the transaction
                  this.diagram.model.commitTransaction('Toggle FromArrow');
                  console.log("FromArrow property of link toggled to:", newArrow);

                }
              }
            }
          ),
          $('ContextMenuButton',
            $(go.TextBlock, "Toggle FromNode Kann/Muss"),
            {
              click: (e, obj) => {
                // Get the data of the link that was clicked
                const linkData = obj.part?.data;

                // Define a type for the possible arrow states
                type ArrowState = 'BackwardLineFork' | 'BackwardCircleFork' | 'DoubleLine' | 'LineCircle';

                // Define the mapping of current states to toggled states
                const arrowToggleMap: Record<ArrowState, ArrowState> = {
                  'BackwardLineFork': 'BackwardCircleFork',
                  'BackwardCircleFork': 'BackwardLineFork',
                  'DoubleLine': 'LineCircle',
                  'LineCircle': 'DoubleLine'
                };

                // Start a transaction to update the link
                this.diagram.model.startTransaction('Toggle FromArrow');

                // Get the current fromArrow state and assert its type
                const currentArrow = linkData.fromArrow as ArrowState;

                console.log("Current Arrow = ", currentArrow)

                // Determine the new state based on the current state
                const newArrow = arrowToggleMap[currentArrow]; // This will be safe now

                // Set the new fromArrow state
                this.diagram.model.setDataProperty(linkData, 'fromArrow', newArrow);

                // Commit the transaction
                this.diagram.model.commitTransaction('Toggle FromArrow');
                console.log("FromArrow kann/muss toggled to:", newArrow);
              }
            }
          ),
          $('ContextMenuButton',
            $(go.TextBlock, "Toggle ToNode Anzahl"),
            {
              click: (e, obj) => {
                // Get the data of the link that was clicked
                const linkData = obj.part?.data;

                // Define a type for the possible arrow states
                type ArrowState = 'DoubleLine' | 'LineCircle' | 'LineFork' | 'CircleFork';

                // Define the mapping of current states to toggled states
                const arrowToggleMap: Record<ArrowState, ArrowState> = {
                  'LineFork': 'DoubleLine',
                  'CircleFork': 'LineCircle',
                  'DoubleLine': 'LineFork',
                  'LineCircle': 'CircleFork'
                };

                // Start a transaction to update the link
                this.diagram.model.startTransaction('Toggle toArrow');

                // Get the current toArrow state and assert its type
                const currentArrow = linkData.toArrow as ArrowState;

                console.log("Current Arrow = ", currentArrow)

                // Determine the new state based on the current state
                const newArrow = arrowToggleMap[currentArrow]; // This will be safe now

                // Set the new toArrow state
                this.diagram.model.setDataProperty(linkData, 'toArrow', newArrow);

                // Commit the transaction
                this.diagram.model.commitTransaction('Toggle toArrow');
                console.log("ToArrow property of link toggled to:", newArrow);
              }
            }
          ),
          $('ContextMenuButton',
            $(go.TextBlock, "Toggle ToNode Kann/Muss"),
            {
              click: (e, obj) => {
                // Get the data of the link that was clicked
                const linkData = obj.part?.data;

                // Define a type for the possible arrow states
                type ArrowState = 'LineFork' | 'CircleFork' | 'DoubleLine' | 'LineCircle';

                // Define the mapping of current states to toggled states
                const arrowToggleMap: Record<ArrowState, ArrowState> = {
                  'LineFork': 'CircleFork',
                  'CircleFork': 'LineFork',
                  'DoubleLine': 'LineCircle',
                  'LineCircle': 'DoubleLine'
                };

                // Start a transaction to update the link
                this.diagram.model.startTransaction('Toggle ToArrow');

                // Get the current toArrow state and assert its type
                const currentArrow = linkData.toArrow as ArrowState;

                console.log("Current Arrow = ", currentArrow)

                // Determine the new state based on the current state
                const newArrow = arrowToggleMap[currentArrow]; // This will be safe now

                // Set the new toArrow state
                this.diagram.model.setDataProperty(linkData, 'toArrow', newArrow);

                // Commit the transaction
                this.diagram.model.commitTransaction('Toggle ToArrow');
                console.log("ToArrow kann/muss toggled to:", newArrow);
              }
            }
          ),
        )
      },
      $(go.Shape, { strokeDashOffset: 1, strokeWidth: 2, stroke: 'grey', strokeDashArray: [1, 0], },
        // binds the link being dashed to the weak property
        new go.Binding('strokeDashArray', 'weak', (k) => (k ? [8, 2] : [8, 0]))
      ),
      $(go.Shape,
        {
          strokeWidth: 1.2,
          scale: 2,
          fill: 'white',
          toArrow: 'Standard'
        },
        new go.Binding('toArrow', 'toArrow')
      ),
      $(go.Shape,
        {
          strokeWidth: 1.2,
          scale: 2,
          fill: 'white',
          fromArrow: 'Standard',
        },
        new go.Binding('fromArrow', 'fromArrow')
      )
    );

    // Listener for selection changes
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

  openEditDialog(obj: go.GraphObject) {
    const contextItem = obj.part;
    if (contextItem?.data) {
      // Öffnet ein Fenster zum Bearbeiten des Elements (angepasst für detaillierte Bearbeitung)
      const newWindow = window.open('', '_blank', 'width=800,height=400');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Tabelle "${contextItem.data.className}" bearbeiten</title>
              <style>
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                button { margin-top: 20px; padding: 10px; }
              </style>
            </head>
            <body>
              <h2>Tabelle "${contextItem.data.className}" bearbeiten</h2>
              <table>
                <thead>
                  <tr>
                    <th>Auswahl</th>
                    <th>Name</th>
                    <th>Datentyp</th>
                    <th>PK</th>
                    <th>NN</th>
                    <th>Unique</th>
                    <th>Check</th>
                    <th>Default</th>
                    <th>FK TableName</th>
                    <th>FK ColumnName</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="checkbox"></td>
                    <td><input type="text" value="${contextItem.data.name || ''}"></td>
                    <td>
                      <select>
                        <option value="integer" ${contextItem.data.datatype === 'integer' ? 'selected' : ''}>integer</option>
                        <option value="string" ${contextItem.data.datatype === 'string' ? 'selected' : ''}>string</option>
                        <option value="boolean" ${contextItem.data.datatype === 'boolean' ? 'selected' : ''}>boolean</option>
                      </select>
                    </td>
                    <td><input type="checkbox" ${contextItem.data.pk ? 'checked' : ''}></td>
                    <td><input type="checkbox" ${contextItem.data.nn ? 'checked' : ''}></td>
                    <td><input type="checkbox" ${contextItem.data.unique ? 'checked' : ''}></td>
                    <td><input type="text" value="${contextItem.data.check || ''}"></td>
                    <td><input type="text" value="${contextItem.data.default || ''}"></td>
                    <td><input type="text" value="${contextItem.data.fkTableName || ''}"></td>
                    <td><input type="text" value="${contextItem.data.fkColumnName || ''}"></td>
                  </tr>
                </tbody>
              </table>
              <button onclick="window.close()">OK</button>
            </body>
          </html>
        `);
      }
    }
  }
  deleteNode(obj: go.GraphObject) {
    const contextItem = obj.part;
    if (contextItem instanceof go.Node && contextItem.diagram) {
      this.diagram.startTransaction('delete node');
      this.diagram.remove(contextItem);
      this.diagram.commitTransaction('delete node');
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

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
    // Initialize the diagram with GridLayout for better initial positioning
    this.diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      layout: $(go.GridLayout, { wrappingColumn: 3, spacing: new go.Size(20, 20) }),
      'draggingTool.dragsLink': true,
      'linkingTool.isUnconnectedLinkValid': true,
      'draggingTool.gridSnapCellSize': new go.Size(10, 1),
      'draggingTool.isGridSnapEnabled': true,
      'undoManager.isEnabled': true,
    });

    // Set auto scale to fit all nodes in view
    this.diagram.autoScale = go.Diagram.Uniform;

    // Assign the model to the diagram
    this.diagram.model = this.model;

    // Define a template for individual items in a node
    const itemTempl = $(go.Panel, 'Horizontal',
      {
        margin: new go.Margin(2, 0),
        background: "transparent",
        click: (e, obj) => {
          e.diagram.select(obj.part);
        }
      },
      $(go.TextBlock,
        {
          font: '14px sans-serif',
          stroke: 'black',
          editable: true,
          isUnderline: false
        },
        new go.Binding('text', 'name'),
        new go.Binding('font', 'choice1', k => (k ? 'italic 14px sans-serif' : '14px sans-serif')),
        new go.Binding('isUnderline', 'choice1', k => !!k),
      ),
      {
        contextMenu: $(go.Adornment, 'Vertical',
          $('ContextMenuButton',
            $(go.TextBlock, 'Make Primary Key'),
            {
              click: (e, obj) => {
                const contextItem = obj.part;
                if (contextItem?.data) {
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
                if (contextItem?.data) {
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
                if (contextItem?.data) {
                  const itemData = contextItem.data;
                  itemData.isNotNull = !itemData.isNotNull;
                  e.diagram.model.updateTargetBindings(itemData);
                }
              }
            }
          )
        )
      },
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
        new go.Binding('location', 'location').makeTwoWay(),

        // Outer frame of the table
        $(go.Shape, 'Rectangle',
          {
            fill: 'lightgreen',
            stroke: "black",
            strokeWidth: 2,
            portId: '',
            cursor: 'pointer',
            fromLinkable: true,
            toLinkable: true,
            alignment: go.Spot.Center,
            stretch: go.Stretch.Fill
          }
        ),

        // Slanted shape for weak tables
        $(go.Shape,
          {
            fill: null,
            stroke: "black",
            strokeWidth: 1.5,
            alignment: go.Spot.Center,
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

    // Initialize palette
    this.myPalette = new go.Palette('myPaletteDiv', {
      nodeTemplate: this.diagram.nodeTemplate,
      contentAlignment: go.Spot.Center,
      layout: $(go.GridLayout, { wrappingColumn: 1, cellSize: new go.Size(2, 2) }),
    });

    this.myPalette.model.nodeDataArray = [
      {
        key: 'ClassKey',
        className: 'Name',
        location: new go.Point(0, 0),
        items: [
          { name: 'NameID', iskey: true },
          { name: 'AnotherAttribute', iskey: false }
        ],
        inheritedItems: []
      },
      {
        key: 'WeakClassKey',
        className: 'Weak Name',
        location: new go.Point(0, 0),
        items: [
          { name: 'NameID', iskey: true },
          { name: 'AnotherAttribute', iskey: false }
        ],
        inheritedItems: [],
        isWeak: true
      }
    ];
    

    // Link template
    this.diagram.linkTemplate = $(go.Link,
      {
        selectionAdorned: false,
        reshapable: true,
        routing: go.Routing.AvoidsNodes,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        relinkableFrom: true,
        relinkableTo: true,
        fromShortLength:100,
        toShortLength:100,
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
                console.log("FromArrow property of link toggled to:", newArrow);
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
                type ArrowState = 'DoubleLine' | 'LineCircle' | 'LineFork' |'CircleFork';

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
      this.nodeClicked.emit(node);
    });

    // Force update layout to ensure nodes are positioned correctly
    this.diagram.layoutDiagram(true);
  }

  zoomIn() {
    if (this.diagram) {
      this.diagram.commandHandler.increaseZoom();
    }
  }

  zoomOut() {
    if (this.diagram) {
      this.diagram.commandHandler.decreaseZoom();
    }
  }
}

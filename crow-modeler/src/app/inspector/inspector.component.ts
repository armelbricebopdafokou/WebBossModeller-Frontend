import { CommonModule } from '@angular/common';
import { Component, Input,  OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as go from 'gojs';

@Component({
  selector: 'app-inspector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.css'
})
export class InspectorComponent {

  public _selectedNode!: go.Node;
  public data = {
    color: null
  };

  @Input()
  public model!: go.Model;

  @Input()
  get selectedNode() { return this._selectedNode; }
  set selectedNode(node: go.Node) {
    if (node && node != null) {
      this._selectedNode = node;
      this.data.color = this._selectedNode.data.color;
    } else {
      alert("Error - this._selectedNode needs to be null")
      // this._selectedNode = null;
    }
  }

  constructor() { }

  public onCommitForm() {
    this.model.startTransaction();
    this.model.set(this.selectedNode.data, 'color', this.data.color);
    this.model.commitTransaction();
  }

}

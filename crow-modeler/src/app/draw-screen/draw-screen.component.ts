import { Component } from '@angular/core';
import { GojsAngularModule } from 'gojs-angular';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GojsDiagramComponent } from '../gojs-diagram/gojs-diagram.component';

@Component({
  selector: 'app-draw-screen',
  standalone: true,
  imports: [GojsAngularModule, GojsDiagramComponent, MatSidenavModule],
  templateUrl: './draw-screen.component.html',
  styleUrl: './draw-screen.component.css'
  // encapsulation: ViewEncapsulation.None
})

export class DrawScreenComponent {
  title = 'crow-modeler';
  events: string[] = [];
  opened: boolean = true;
}
import { Component } from '@angular/core';
import { GojsAngularModule } from 'gojs-angular';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip'; // Hinzufügen des Tooltip-Moduls
import { GojsDiagramComponent } from '../gojs-diagram/gojs-diagram.component';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-draw-screen',
  standalone: true,
  imports: [
    GojsAngularModule,
    GojsDiagramComponent,
    MatSidenavModule,
    HeaderComponent,
    RouterLink,
    RouterLinkActive,
    MatTooltipModule // Hinzufügen des MatTooltipModule
  ],
  templateUrl: './draw-screen.component.html',
  styleUrl: './draw-screen.component.css'
  // encapsulation: ViewEncapsulation.None
})

export class DrawScreenComponent {
  title = 'crow-modeler';
  events: string[] = [];
  opened: boolean = true;

  onButtonClick() {
    console.log('Button clicked!');
    // Hier kannst du deine spezifische Logik hinzufügen
  }
}

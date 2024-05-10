import { Component } from '@angular/core';
import { GojsAngularModule } from 'gojs-angular';
import * as go from 'gojs';

@Component({
  selector: 'app-draw-screen',
  standalone: true,
  imports: [GojsAngularModule],
  templateUrl: './draw-screen.component.html',
  styleUrl: './draw-screen.component.css'
  // encapsulation: ViewEncapsulation.None
})

export class DrawScreenComponent {  

}
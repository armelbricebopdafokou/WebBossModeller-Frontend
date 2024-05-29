import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip'; // Importieren des Tooltip-Moduls
import { NgIf } from '@angular/common'; // Beispiel für zusätzliche Direktiven, die du möglicherweise verwenden möchtest
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatTooltipModule, NgIf, RouterOutlet, RouterLink, RouterLinkActive], // Hinzufügen des Tooltip-Moduls zu den Imports
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

}

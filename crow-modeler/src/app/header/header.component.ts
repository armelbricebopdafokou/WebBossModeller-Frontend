import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip'; // Importieren des Tooltip-Moduls
import {MatIconModule} from '@angular/material/icon'
import { NgIf } from '@angular/common'; // Beispiel für zusätzliche Direktiven, die du möglicherweise verwenden möchtest
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatTooltipModule, 
    NgIf, 
    RouterOutlet,
    MatButtonModule,
    MatMenuModule,
     RouterLink,
     MatIconModule,
      RouterLinkActive], // Hinzufügen des Tooltip-Moduls zu den Imports
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

}

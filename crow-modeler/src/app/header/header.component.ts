import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatTooltipModule, NgIf, RouterOutlet, RouterLink, RouterLinkActive, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild('drawScreen') drawScreen!: ElementRef;
  private zoomLevel: number = 1;

  navigateHome() {
    console.log('Navigating to Home');
    // Hier könnte Navigationslogik hinzugefügt werden
  }

  createNewProject() {
    console.log('Creating a new project');
    // Logik für das Erstellen eines neuen Projekts
  }

  openProject() {
    console.log('Opening an existing project');
    // Logik zum Öffnen eines Projekts
  }

  saveProject() {
    console.log('Saving the current project');
    // Speichere das aktuelle Projekt
  }

  exportImage() {
    console.log('Exporting as SVG');
    if (this.drawScreen) {
      const svgElement = this.drawScreen.nativeElement.querySelector('svg');
      if (svgElement) {
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svgElement)], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'exported_image.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log('SVG export successful');
      } else {
        console.error('No SVG element found in drawScreen');
      }
    }
  }

  exportSQL() {
    console.log('Exporting as SQL');
    // Exportiere das Projekt als SQL-Datei
  }

  reload() {
    console.log('Reloading the page');
    window.location.reload();
    // Seite neu laden oder Inhalt aktualisieren
  }

  zoomIn() {
    console.log('Zooming in');
    if (this.drawScreen) {
      this.zoomLevel += 0.1;
      this.drawScreen.nativeElement.style.transform = `scale(${this.zoomLevel})`;
      this.drawScreen.nativeElement.style.transformOrigin = '0 0';
    }
  }

  zoomOut() {
    console.log('Zooming out');
    if (this.drawScreen && this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1;
      this.drawScreen.nativeElement.style.transform = `scale(${this.zoomLevel})`;
      this.drawScreen.nativeElement.style.transformOrigin = '0 0';
    }
  }

  logout() {
    console.log('Logging out');
    // Hier wird die Auslog-Funktion ausgeführt
  }
}

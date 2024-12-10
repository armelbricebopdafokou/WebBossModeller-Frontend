import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { DrawingModeService } from '../drawing-mode.service';
import { DrawScreenComponent } from '../draw-screen/draw-screen.component';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatTooltipModule, NgIf, RouterOutlet, RouterLink, RouterLinkActive, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild('drawScreen', { static: true }) drawScreen!: ElementRef;
  @ViewChild(DrawScreenComponent, { static: false }) drawScreenComponent!: DrawScreenComponent;
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
    console.log('Exporting image as PNG via GojsDiagramComponent');

    // Zugriff auf den Diagramm-Bereich
    const element = document.querySelector('#gojs-diagram'); // Stellt sicher, dass das Diagramm-Element erfasst wird

    if (element && element instanceof HTMLElement) {
      html2canvas(element).then(canvas => {
        // Canvas in ein Bild umwandeln
        const screenshot = canvas.toDataURL('image/png');

        // Erstellen eines Download-Links
        const downloadLink = document.createElement('a');
        downloadLink.href = screenshot;
        downloadLink.download = 'exported_diagram.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log('PNG export successful');
        alert('Diagramm erfolgreich exportiert!');
      }).catch(error => {
        console.error('Error during PNG export:', error);
        alert('Fehler beim Exportieren des Diagramms. Bitte versuchen Sie es erneut.');
      });
    } else {
      console.error('GojsDiagramComponent not found or not an HTMLElement');
      alert('Diagramm-Bereich nicht gefunden oder ungültig!');
    }
  }


  exportSQL() {
    console.log('Exporting as SQL');
    // Exportiere das Projekt als SQL-Datei
  }

  reload() {
    const confirmReload = window.confirm('Sind Sie sicher, dass Sie die Seite neu laden möchten? Ungespeicherte Änderungen könnten verloren gehen.');
    if (confirmReload) {
      console.log('Die Seite wird neu geladen');
      window.location.reload();
    } else {
      console.log('Das Neuladen wurde abgebrochen');
    }
  }

  isAdvancedMode!: boolean;

  constructor(private drawingModeService: DrawingModeService) {
    this.drawingModeService.currentMode.subscribe(mode => {
      this.isAdvancedMode = mode;
    });
  }

  // Method for toggle button. Toggles between easy and advanced mode
  toggleMode(event: Event) {
    this.drawingModeService.toggleMode();
  }

  logout() {
    console.log('Logging out');
    sessionStorage.clear(); // Löscht Sitzungsdaten
    localStorage.clear(); // Löscht gespeicherte Token
    window.location.href = '/login'; // Weiterleitung zur Login-Seite
  }
}


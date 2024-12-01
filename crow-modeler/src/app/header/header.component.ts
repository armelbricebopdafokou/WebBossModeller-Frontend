import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { DrawingModeService } from '../drawing-mode.service';
import { DrawScreenComponent } from '../draw-screen/draw-screen.component';

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
  isAdvancedMode: boolean = false;

  constructor(private drawingModeService: DrawingModeService) {
    this.drawingModeService.currentMode.subscribe(mode => {
      this.isAdvancedMode = mode;
    });
  }

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
    console.log('Exporting image as PNG via HeaderComponent');
    if (this.drawScreenComponent) {
      const svgElement = this.drawScreenComponent.drawScreen.nativeElement.querySelector('svg');
      if (svgElement) {
        try {
          const svgString = new XMLSerializer().serializeToString(svgElement);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();

          img.onload = () => {
            // Set canvas dimensions based on the loaded image dimensions
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);

            // Convert canvas to blob and provide a download link
            canvas.toBlob((blob) => {
              if (blob) {
                const pngUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = 'exported_image.png';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(pngUrl);
                console.log('PNG export successful');
              } else {
                console.error('Failed to create a PNG blob');
              }
            }, 'image/png');
          };

          // Assign the SVG data to the image source
          img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        } catch (error) {
          console.error('Error during PNG export:', error);
        }
      } else {
        console.error('No SVG element found in drawScreen');
      }
    } else {
      console.error('DrawScreenComponent not found');
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

  isAdvancedMode: boolean = false;

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
    // Hier wird die Auslog-Funktion ausgeführt
  }
}

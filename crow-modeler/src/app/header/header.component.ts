import { Component, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import {  RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DrawingModeService } from '../drawing-mode.service';
import { DrawScreenComponent } from '../draw-screen/draw-screen.component';
import html2canvas from 'html2canvas';





@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatTooltipModule,  RouterLink, RouterLinkActive, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  @ViewChild('drawScreen', { static: true }) drawScreen!: ElementRef;
  @ViewChild(DrawScreenComponent, { static: false }) drawScreenComponent!: DrawScreenComponent;
  private zoomLevel: number = 1;

  isAdvancedMode!: boolean;
  
  @Output() clicked = new EventEmitter<boolean>()
  @Output() openImport = new EventEmitter<boolean>()
  @Output() openExistingProejcts = new EventEmitter<boolean>()
  @Output() export = new EventEmitter<string>()

  constructor(private drawingModeService: DrawingModeService) {
    this.drawingModeService.currentMode.subscribe(mode => {
      this.isAdvancedMode = mode;
    });
  }

  readonly dialog = inject(MatDialog);

  

  navigateHome() {
    console.log('Navigating to Home');
    // Hier könnte Navigationslogik hinzugefügt werden
  }

  createNewProject() {
    console.log('Creating a new project');
    // Logik für das Erstellen eines neuen Projekts
  }

  openProject() {
   this.openExistingProejcts.emit(true)

    console.log('Opening an existing project');
    
  }

  saveProject() {
    console.log('Saving the current project');
    // Speichere das aktuelle Projekt
    this.clicked.emit(true)
  }

  exportImage() {
    console.log('Exporting image as PNG via GojsDiagramComponent');
    
    // Zugriff auf den Diagramm-Bereich
    const element = document.querySelector('#gojs-diagram'); // Stellt sicher, dass das Diagramm-Element erfasst wird
    console.log(element);

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


  exportSQLMssql() {
    this.export.emit('MSSQL')
  }


  exportToSql(){
    this.export.emit('export')
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

  public importDiagram()
  {
    this.openImport.emit(true)
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
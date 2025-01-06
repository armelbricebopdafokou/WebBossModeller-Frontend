import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

import { FormsModule } from '@angular/forms'; // Für ngModel
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field'; // Für mat-form-field
import { MatInputModule } from '@angular/material/input'; // Für matInput
import { MatDialogModule } from '@angular/material/dialog'; // Für MatDialog
import { MatIconModule } from '@angular/material/icon'; // Für mat-icon

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // `styleUrl` korrigiert zu `styleUrls`
})
export class AppComponent {
  title = "crow-modeler";
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Service to handle the toggle of the drawing mode.

@Injectable({
  providedIn: 'root'
})
export class DrawingModeService {
  private isAdvancedMode = new BehaviorSubject<boolean>(false); // Default to Easy Mode
  currentMode = this.isAdvancedMode.asObservable();

  toggleMode() {
    this.isAdvancedMode.next(!this.isAdvancedMode.value);
    console.log("Toggled Easy/Advanced Mode!")
  }
}

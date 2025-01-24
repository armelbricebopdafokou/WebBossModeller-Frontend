import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSaveGraphicComponent } from './dialog-save-graphic.component';

describe('DialogSaveGraphicComponent', () => {
  let component: DialogSaveGraphicComponent;
  let fixture: ComponentFixture<DialogSaveGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSaveGraphicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSaveGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

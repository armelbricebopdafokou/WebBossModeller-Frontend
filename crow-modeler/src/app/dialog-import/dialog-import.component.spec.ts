import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImportComponent } from './dialog-import.component';

describe('DialogImportComponent', () => {
  let component: DialogImportComponent;
  let fixture: ComponentFixture<DialogImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogImportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

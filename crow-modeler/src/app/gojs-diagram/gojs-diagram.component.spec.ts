import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GojsDiagramComponent } from './gojs-diagram.component';

describe('GojsDiagramComponent', () => {
  let component: GojsDiagramComponent;
  let fixture: ComponentFixture<GojsDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GojsDiagramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GojsDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

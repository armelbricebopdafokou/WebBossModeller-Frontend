import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawScreenComponent } from './draw-screen.component';

describe('DrawScreenComponent', () => {
  let component: DrawScreenComponent;
  let fixture: ComponentFixture<DrawScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DrawScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

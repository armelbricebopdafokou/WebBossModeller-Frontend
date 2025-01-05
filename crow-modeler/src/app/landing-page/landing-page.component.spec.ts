import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageComponent } from './landing-page.component';
import { RouterModule } from '@angular/router';
import { DrawScreenComponent } from '../draw-screen/draw-screen.component';
import { LoginScreenComponent } from '../login-screen/login-screen.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent, RouterModule.forRoot([
        { path: 'draw-screen', component: DrawScreenComponent }, 
        { path: 'login', component: LoginScreenComponent},
      ])]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

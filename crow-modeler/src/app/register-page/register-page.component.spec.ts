import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPageComponent } from './register-page.component';

import { RouterModule } from '@angular/router';
import { DrawScreenComponent } from '../draw-screen/draw-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent, BrowserAnimationsModule, RouterModule.forRoot(
        [ {path: 'draw-screen', component: DrawScreenComponent}]
      )]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Email field has incorrect format', ()=>{
    component!.registerForm.controls['email'].setValue('test@exemple.c');
    let errors = {} as any;
    errors = component!.registerForm.controls['email'].errors || {}
    expect(errors['pattern']).toBeTruthy();
  })
  
  it('The password length is correct', ()=>{
    component!.registerForm.controls['password'].setValue('wa$Test95#');

    let errors = {} as any;
    errors = component!.registerForm.controls['password'].errors || {}
    expect(errors['minlength']).toBeFalsy();
  })

 
  it('Email field is valid', ()=>{
    component!.registerForm.controls['email'].setValue('test@exemple.de');
    expect(component!.registerForm.controls['email'].valid).toBeTruthy();
  })



});

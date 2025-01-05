import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginScreenComponent } from './login-screen.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../services/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';


describe('LoginScreenComponent', () => {
  let component: LoginScreenComponent;
  let fixture: ComponentFixture<LoginScreenComponent>;

  beforeEach( waitForAsync( () => {
     TestBed.configureTestingModule({
      imports: [LoginScreenComponent, HttpClientModule, HttpClientTestingModule, BrowserAnimationsModule, ReactiveFormsModule],
     
    }).compileComponents();
  }));
  beforeEach(()=>{
    fixture = TestBed.createComponent(LoginScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('form invalid when empty', ()=>{
    
    expect(component.loginForm.valid).toBeFalsy();
  });

 
  it('Email field has incorrect format', ()=>{
    component!.loginForm.controls['emailCtrl'].setValue('test@exemple.c');
    let errors = {} as any;
    errors = component!.loginForm.controls['emailCtrl'].errors || {}
    expect(errors['pattern']).toBeTruthy();
  })
  
  it('The password length is correct', ()=>{
    component!.loginForm.controls['passwordCtrl'].setValue('wa$Test95#');

    let errors = {} as any;
    errors = component!.loginForm.controls['passwordCtrl'].errors || {}
    expect(errors['minlength']).toBeFalsy();
  })

 
  it('Email field is valid', ()=>{
    component!.loginForm.controls['emailCtrl'].setValue('test@exemple.de');
    expect(component!.loginForm.controls['emailCtrl'].valid).toBeTruthy();
  })
});

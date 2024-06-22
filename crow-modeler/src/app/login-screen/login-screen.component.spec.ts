import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginScreenComponent } from './login-screen.component';

describe('LoginScreenComponent', () => {
  let component: LoginScreenComponent;
  let fixture: ComponentFixture<LoginScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form invalid when empty', ()=>{
    expect(component.loginForm.valid).toBeFalsy();
  });

  component!.loginForm.controls['emailCtrl'].setValue('test@exemple.c');
  it('Email field has incorrect format', ()=>{
    let errors = {} as any;
    errors = component!.loginForm.controls['emailCtrl'].errors || {}
    expect(errors['pattern']).toBeTruthy();
  })
  component!.loginForm.controls['passwordCtrl'].setValue('wa$Test95#');

  it('The password length is correct', ()=>{
    let errors = {} as any;
    errors = component!.loginForm.controls['passwordCtrl'].errors || {}
    expect(errors['minlength']).toBeFalsy();
  })

  component!.loginForm.controls['emailCtrl'].setValue('test@exemple.de');
  it('Email field is valid', ()=>{
    expect(component!.loginForm.controls['emailCtrl'].valid).toBeTruthy();
  })
});

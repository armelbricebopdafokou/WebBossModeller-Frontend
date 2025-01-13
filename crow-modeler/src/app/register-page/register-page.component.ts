import { AfterViewInit, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    MatButtonModule,
         MatCardModule,
         NgIf,
         ReactiveFormsModule, 
         MatFormFieldModule, 
         MatInputModule, 
         MatIconModule
  ],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements AfterViewInit {

  registerForm = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required, this.validateSamePassword]),
    })
    hide = true;
  
    constructor(private userservice:UserService, private router:Router) { }

    //login$!: Observable<User>;
    errorMessage:any
  
  ngAfterViewInit(): void {
     document.body.style.backgroundColor='#9EF2E4'
  }

  get email() {
    return this.registerForm.get('email')!;
  }
  get password() {
    return this.registerForm.get('password')!;
  }
  get firstname() {
    return this.registerForm.get('firstName')!;
  }
  get lastname() {
    return this.registerForm.get('lastName')!;
  }

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const pass = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    return pass?.value == confirmPassword?.value ? null : { 'notSame': true };
  }


  submitForm(){
    console.log(this.registerForm.value)
   this.userservice.register(this.registerForm.value).subscribe({
      next: (data: any)=> {
        console.log(data)
        //this.router.navigate(['/draw-screen'])
      },
      error: (err: any)=> {
        console.log(err)
        this.errorMessage = err.error.message
      },
      complete: ()=> {
        this.router.navigate(['/login'])
      }
    });
      /*let obj = {
            "username": this.email.value,
            "password": this.password.value
          }
          
            this.service.login(obj).subscribe({
             next: (data: any)=> {
              console.log(data)         
               
                  localStorage.setItem('authToken', data.token); // Save token
                  this.router.navigate(['/draw-screen'])
                
              },
              error: (err:HttpErrorResponse )=> {
                
                this.toastr.error(err.error.message, 'Error');
              },
             complete: ()=> {
             
              }
            })*/
    }
  
}



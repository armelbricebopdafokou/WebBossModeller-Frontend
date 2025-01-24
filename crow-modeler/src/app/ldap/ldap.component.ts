import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-ldap',
  standalone: true,
  imports: [
    MatButtonModule,
         MatCardModule,
         NgIf,
         ReactiveFormsModule, 
         MatCheckboxModule,
         MatFormFieldModule, 
         MatInputModule, 
         MatIconModule
  ],
  templateUrl: './ldap.component.html',
  styleUrl: './ldap.component.css'
})
export class LDAPComponent {
 loginForm = new FormGroup({
    emailCtrl : new FormControl('', [Validators.required, Validators.email, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")]),
    passwordCtrl: new FormControl('', [Validators.required, Validators.minLength(8)]),
    rememberMeCtrl: new FormControl()
  })
  hide = true;

  //login$!: Observable<User>;
  errorMessage:any
  constructor(private service: UserService,
    private toastr: ToastrService,
     private router: Router){

  }
  
ngAfterViewInit(){  
  document.body.style.backgroundColor='#9EF2E4'
}

  get email() {
    return this.loginForm.get('emailCtrl')!;
  }
  get password() {
    return this.loginForm.get('passwordCtrl')!;
  }
  submitForm(){
    let obj = {
      "username": this.email.value,
      "password": this.password.value
    }
    
      this.service.loginLDAP(obj).subscribe({
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
      })
  }
}

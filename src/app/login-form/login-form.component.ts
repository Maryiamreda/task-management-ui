import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
    FormGroup,
    FormControl,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})


export class LoginFormComponent {
  loginForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });
    constructor(
      private auth: AuthService,
      private http: HttpClient,
       private router: Router ) {}

    get name() {
        return this.loginForm.get('name');
    }
    
    get password() {
        return this.loginForm.get('password');
    }
  onSubmit() {
    console.log("log in works !")
  if (this.loginForm.valid) {
    const { name, password } = this.loginForm.value;

    this.http.post<{ token: string }>(
      'http://localhost:8080/login',
      { username: name, password: password }, 
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: (response) => {   
        if (response.token) {
          console.log('logged in !')
          localStorage.setItem('jwt', response.token);
          this.auth.setAuthenticated(true);
                    console.log('setAuthenticated now we are going to /users/me/tasks ' )

          this.router.navigate(['/users/me/tasks']);
        } else {
          alert("Authentication failed - no token received.");
        }
      },
      error: (error) => {
        alert("Authentication failed.");
        console.log('this is level of auth we are up to',this.auth.isAuthenticated$)

        console.log(error, { name, password });
        this.auth.setAuthenticated(false);
      }
    });
  }
}
}

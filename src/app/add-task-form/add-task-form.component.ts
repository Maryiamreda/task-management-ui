import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; 
import { StatusEnum } from '../types/task';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import {
    FormGroup,
    FormControl,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-add-task-form',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule,
     MatFormFieldModule,
    MatSelectModule,
    MatOptionModule],
  templateUrl: './add-task-form.component.html',
  styleUrl: './add-task-form.component.css'
})
export class AddTaskFormComponent {
  
  statusEnum=StatusEnum;
   d = new Date();

    addNewTaskForm = new FormGroup({
          title: new FormControl('', [Validators.required, Validators.minLength(3)]),
          description: new FormControl('', [ Validators.minLength(9)]),
          status: new FormControl(StatusEnum.TODO, Validators.required), 
          dueDate: new FormControl(new Date(), Validators.required),
      });

  constructor(private http: HttpClient, private router: Router, public auth:AuthService) {}

  // Getters for template
  get title() {
    return this.addNewTaskForm.get('title');
  }

  get description() {
    return this.addNewTaskForm.get('description');
  }

  get status() {
    return this.addNewTaskForm.get('status');
  }

  get dueDate() {
    return this.addNewTaskForm.get('dueDate');
  }
onSubmit() {
  if (this.addNewTaskForm.valid) {
    const token = localStorage.getItem('jwt');
    
    this.http.post('http://localhost:8080/users/me/tasks/add', this.addNewTaskForm.value, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .subscribe({
      next: (res) => {
        console.log('Task created');
        this.router.navigate(['users/me/tasks']);
      },
      error: (err) => console.error('Error creating task'),
    });
  }
}
}

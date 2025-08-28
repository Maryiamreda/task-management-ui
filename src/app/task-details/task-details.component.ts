
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Task , StatusEnum } from '../types/task';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , MatDialogModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent implements OnInit {
  private apiUrl = 'http://localhost:8080/users/me/tasks';

  task: Task | null = null;
  taskId: string | null = null;
  editMode: boolean = false;
  deleteDialog:boolean=false;


  editForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.minLength(9)]),
    status: new FormControl('', Validators.required),
    dueDate: new FormControl('', Validators.required),
  });

  constructor( private route: ActivatedRoute,private router: Router,private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

  ngOnInit() {
    // Get task ID from route parameters
    this.taskId = this.route.snapshot.paramMap.get('id');
    
    // Get task data from navigation state (if available)
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    
    if (state?.taskData) {
      this.task = state.taskData;
      this.populateForm();
    } else {
      // If no state data, you could fetch from API using taskId
      // or redirect back to dashboard
      console.warn('No task data available');
      // this.router.navigate(['/users/me/tasks']);
    }
  }

//????
  populateForm() { 
    if (this.task) {
   
      const formattedDate = this.task.dueDate ? this.formatDateForInput(this.task.dueDate) : '';
      
      this.editForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        dueDate: formattedDate
      });
    }
  }

  formatDateForInput(dateValue: any): string {
    if (!dateValue) return '';
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  }

deleteTask() {
  if (this.taskId) {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('jwt') || '';
    }

    this.http.delete(`${this.apiUrl}/delete/${this.taskId}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },   responseType: 'text' 
    }).subscribe({
      next: () => {
        console.log('Task deleted successfully');
        this.router.navigate(['users/me/tasks']); 
      },
      error: (err) => {
        console.error('Error deleting task:', err);
      }
    });
  }
}


  updateTask() {
    if (this.editForm.valid && this.taskId) {

      let token = '';
      if (isPlatformBrowser(this.platformId)) {
        token = localStorage.getItem('jwt') || '';
      }

      this.http.put<Task>(`${this.apiUrl}/edit/${this.taskId}`, this.editForm.value, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).subscribe({
        next: (updatedTask) => {
          this.task = updatedTask;
          this.editMode = false;
          
        },
        error: (err) => {
        
          console.error('Error updating task:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }
//???
  markFormGroupTouched() {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
 }

openDialog(){
     this.deleteDialog = true;
}

closeDialog() {
  this.deleteDialog = false;
}
  setEditMode() {
    this.editMode = true;

    this.populateForm();
}





  goBack() {
    this.router.navigate(['users/me/tasks']);
  }
  get title() {
    return this.editForm.get('title');
  }

  get description() {
    return this.editForm.get('description');
  }

  get status() {
    return this.editForm.get('status');
  }

  get dueDate() {
    return this.editForm.get('dueDate');
  }
}
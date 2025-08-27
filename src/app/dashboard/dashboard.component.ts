import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddTaskFormComponent } from '../add-task-form/add-task-form.component';
import { Task, StatusEnum } from '../types/task';
import { AuthService } from '../services/auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AddTaskFormComponent,
    MatTableModule,
    MatSelectModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  allTasks: Task[] = [];
  StatusEnum = StatusEnum;

  private apiUrl = 'http://localhost:8080/users/me/tasks';

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('jwt');
      this.auth.setAuthenticated(!!token);

      if (this.auth.isAuthenticated$) {
        this.getTasks().subscribe({
          next: (tasks: Task[]) => {
            this.allTasks = tasks;
            this.tasks = [...this.allTasks];
          },
          error: (err) => {
            if (err.status === 403) {
              this.auth.setAuthenticated(false);
              this.router.navigate(['users/login']);
            }
          }
        });
      }
    }
  }

  getTasks(): Observable<Task[]> {
    let token = '';

    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('jwt') || '';
    }

    return this.http.get<Task[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Filter status
  FilterByStatus(status: StatusEnum) {
    this.tasks = this.allTasks.filter(task => task.status === status);
  }

  ClearFilterByStatus() {
    this.tasks = [...this.allTasks];
  }

  
    sortByDateasc() {
    this.ClearFilterByStatus();
    this.tasks = [...this.tasks].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB; 
    });
  }
  sortByDatedesc() {
    this.ClearFilterByStatus();
    this.tasks = [...this.tasks].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
return dateB - dateA;
    });
  }
    // Search (uncomment if you want)
  searchByTitle(text: string) {
    const searchText = text.toLowerCase().trim();
    if (searchText === '') {
      this.ClearFilterByStatus();
      return;
    }
    this.tasks = this.allTasks.filter(task =>
      task.title.toLowerCase().includes(searchText) ||
      task.description?.toLowerCase().includes(searchText)
    );
  }

  // View task details
  viewTask(task: Task) {
    this.router.navigate(['users/me/tasks', task.id], {
      state: {
        taskData: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate,
        }
      }
    });
  }
}

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
  filteredTasks: Task[] = []; // Add this to track filtered results
  currentSearchText: string = ''; // Track current search
  currentStatusFilter: StatusEnum | null = null; // Track current status filter
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
            this.applyFilters(); // Apply filters instead of direct assignment
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

  // Improved filter method that combines both search and status filters
  applyFilters() {
    let result = [...this.allTasks];

    // Apply status filter first
    if (this.currentStatusFilter !== null) {
      result = result.filter(task => task.status === this.currentStatusFilter);
    }

    // Apply search filter
    if (this.currentSearchText.trim() !== '') {
      const searchText = this.currentSearchText.toLowerCase().trim();
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchText) ||
        (task.description && task.description.toLowerCase().includes(searchText))
      );
    }

    this.tasks = result;
  }

  // Updated filter status method
  FilterByStatus(status: StatusEnum) {
    this.currentStatusFilter = status;
    this.applyFilters();
  }

  // Updated clear filter method
  ClearFilterByStatus() {
    this.currentStatusFilter = null;
    this.applyFilters();
  }

  // Fixed search method
  searchByTitle(text: string) {
    this.currentSearchText = text;
    this.applyFilters();
  }

  // Clear search method (optional - you can add a clear button)
  clearSearch() {
    this.currentSearchText = '';
    this.applyFilters();
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
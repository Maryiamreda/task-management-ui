import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: any[] = [];

  constructor(
    private dataService: DataService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.dataService.getUsers().subscribe(
      data => this.users = data,
      error => console.error(error)
    );
  }

logOut() {
  const token = localStorage.getItem('jwt');
  return this.http.post(
    'http://localhost:8080/logout',
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  ).subscribe({
    next: () => {
      localStorage.removeItem('jwt');
      console.log('Logged out');
    },
    error: err => console.error('Logout failed', err)
  });
}

}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  title = 'my-app';
  users: any[] | undefined;
  constructor(private dataService: DataService) {}
  ngOnInit() {
    this.dataService.getUsers().subscribe(
      data => this.users = data,
      error => console.error(error),
      () => console.log('users loaded')
    );
  }
}

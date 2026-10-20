import { Component, signal } from '@angular/core';
import { List } from './pages/employee/list/list';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  
}

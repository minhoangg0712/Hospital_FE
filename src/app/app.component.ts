import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./component/header/header.component";
import { FooterComponent } from './component/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project-angular';
  isAuthPage: boolean = false;
  role: string | null = null; 

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAuthPage = event.url.includes('/login') 
          || event.url.includes('/register')
          || event.url.includes('/doctor');

        // 🔹 Lấy role từ localStorage (hoặc bạn có thể thay bằng API call)
        this.role = localStorage.getItem('userRole');  
      }
    });
  }
}

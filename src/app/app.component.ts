import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./component/header/header.component";
import { FooterComponent } from './component/footer/footer.component';
import { CommonModule } from '@angular/common';
import { HeaderPatientComponent } from './component/header-patient/header-patient.component';  // Import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule, HeaderPatientComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project-angular';
  isAuthPage: boolean = false;
  isPatientPage: boolean = false;
  role: string | null = null;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;  // Dùng urlAfterRedirects để tránh lỗi redirect

        this.isAuthPage = url.includes('/login') 
          || url.includes('/register')
          || url.includes('/doctor');

        this.role = localStorage.getItem('userRole');  

        // Kiểm tra trang bệnh nhân
        this.isPatientPage = url.includes('/patient');  
      }
    });
  }
}

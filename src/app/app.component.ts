import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./component/header/header.component";
import { FooterComponent } from './component/footer/footer.component';
import { CommonModule } from '@angular/common';
import { HeaderDoctorComponent } from './component/header-doctor/header-doctor.component';
import { FooterDoctorComponent } from './component/footer-doctor/footer-doctor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    HeaderComponent, 
    FooterComponent, 
    CommonModule,
    HeaderDoctorComponent,
    FooterDoctorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project-angular';
  isAuthPage: boolean = false;
  isDoctor: boolean = false;
  isAdmin: boolean = false;

  constructor(private router: Router) {
    // Cập nhật trạng thái ban đầu
    this.updateLoginStatus();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Kiểm tra trang auth
        this.isAuthPage = event.url.includes('/login') 
          || event.url.includes('/register')
          || event.url.includes('/forgot-password')
          || event.url.includes('/admin-home')
          || event.url.includes('/admin-create-doctor')
          || event.url.includes('/admin-doctor-list');

        // Cập nhật trạng thái đăng nhập khi có sự kiện navigation
        this.updateLoginStatus();
      }
    });
  }

  private updateLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const role = payload.role;
        this.isDoctor = role === 'ROLE_DOCTOR' || role === 'ROLE_MGR';
        this.isAdmin = role === 'ROLE_ADMIN';
      } catch (error) {
        console.error('Lỗi khi parse token:', error);
        this.isDoctor = false;
        this.isAdmin = false;
      }
    } else {
      this.isDoctor = false;
      this.isAdmin = false;
    }
  }
}

import { Component, OnInit,} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-doctor',
  imports: [RouterModule,CommonModule],
  standalone: true,
  templateUrl: './header-doctor.component.html',
  styleUrl: './header-doctor.component.css'
})
export class HeaderDoctorComponent implements OnInit {
  isLoggedIn: boolean = false;
  isLogoutModalOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Kiểm tra trạng thái đăng nhập
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

  openLogoutModal() {
    this.isLogoutModalOpen = true;
  }

  closeLogoutModal() {
    this.isLogoutModalOpen = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.isLogoutModalOpen = false;
    this.router.navigate(['/']);
  }

  goToProfile(){
    this.router.navigate(['/profile-doctor']);
  }
}
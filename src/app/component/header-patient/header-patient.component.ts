import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-patient',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-patient.component.html',
  styleUrls: ['./header-patient.component.css'], 
})
export class HeaderPatientComponent {
  isLogoutModalOpen = false; 

  constructor(private router: Router) {} 

  openLogoutModal() {
    this.isLogoutModalOpen = true;
  }

  closeLogoutModal() {
    this.isLogoutModalOpen = false;
  }

  logout() {
    console.log("Người dùng đã đăng xuất");
    this.isLogoutModalOpen = false;
    this.router.navigate(['']);
  }
}

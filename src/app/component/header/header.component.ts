import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isLogoutModalOpen: boolean = false;
  private routerSubscription: Subscription;

  constructor(private router: Router) {
    // Lắng nghe sự kiện navigation
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLoginStatus();
    });
  }

  ngOnInit() {
    this.checkLoginStatus();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    
    // Nếu không có token mà đang ở trang cần xác thực, chuyển về trang chủ
    if (!this.isLoggedIn) {
      const protectedRoutes = ['/profile', '/appointment', '/medicine', '/patient-medical-records'];
      if (protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
        this.router.navigate(['/']);
      }
    }
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
}
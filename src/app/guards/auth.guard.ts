import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Nếu là admin và đang ở trang login, chuyển hướng về trang admin
    if (userRole === 'ADM' && window.location.pathname === '/login') {
      this.router.navigate(['/admin-home']);
      return false;
    }

    // Kiểm tra quyền admin cho các route admin
    if (window.location.pathname.startsWith('/admin')) {
      if (userRole !== 'ADM') {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }

    // Nếu là admin, chỉ cho phép truy cập trang admin
    if (userRole === 'ADM') {
      this.router.navigate(['/admin-home']);
      return false;
    }

    return true;
  }
} 
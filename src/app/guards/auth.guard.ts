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

    // Kiểm tra quyền admin cho các route admin
    if (window.location.pathname.startsWith('/admin') && userRole !== 'ADM') {
      this.router.navigate(['/']);
      return false;
    }

    // Kiểm tra quyền doctor cho các route doctor
    if (window.location.pathname.startsWith('/doctor') && 
        !['DOCTOR', 'MGR'].includes(userRole || '')) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
} 
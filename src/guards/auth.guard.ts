import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Kiểm tra token trong localStorage

    if (!token) {
      this.router.navigate(['/login']); // Chuyển hướng về trang đăng nhập
      return false;
    }

    return true; // Cho phép vào trang nếu đã đăng nhập
  }
}

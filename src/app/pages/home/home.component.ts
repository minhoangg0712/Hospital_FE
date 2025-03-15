import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Kiểm tra nếu người dùng đã đăng nhập
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    // Chỉ chuyển hướng nếu cả token và role đều tồn tại
    if (token && userRole) {
      if (userRole === 'DOCTOR' || userRole === 'MGR') {
        this.router.navigate(['/doctor']);
      } else if (userRole === 'PATIENT') {
        this.router.navigate(['/patient']);
      }
    }
    // Nếu chưa đăng nhập, giữ nguyên ở trang chủ
  }
}

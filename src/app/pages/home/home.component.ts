import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('slideshow') slideshow!: ElementRef;
  currentSlide = 0;
  slideInterval: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
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

  ngAfterViewInit() {
    this.startSlideshow();
  }

  startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Chuyển slide sau mỗi 5 giây
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    const slideshowElement = this.slideshow.nativeElement;
    slideshowElement.style.transform = `translateX(-${this.currentSlide * 33.333}%)`;
    
    // Cập nhật trạng thái active cho dots
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Reset interval
    clearInterval(this.slideInterval);
    this.startSlideshow();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % 3;
    this.goToSlide(this.currentSlide);
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + 3) % 3;
    this.goToSlide(this.currentSlide);
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}

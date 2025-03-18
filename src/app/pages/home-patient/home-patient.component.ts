import { Component, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import { Router, RouterModule } from '@angular/router'

@Component({
  selector: 'app-home-patient',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-patient.component.html',
  styleUrl: './home-patient.component.css'
})
export class HomePatientComponent  implements AfterViewInit {
  @ViewChild('slideshow') slideshow!: ElementRef;
  currentSlide = 0;
  slideInterval: any;

  constructor(private router: Router) {}

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

  gotoPatient(){
    this.router.navigate(['/patient']);
  }
  
  goToMedicine() {
    this.router.navigate(['/medicine']);
  }

  goToAppointment() {
    this.router.navigate(['/appointment']);
  }


  goToCartComponent() {
    this.router.navigate(['/cart']);
  }
}
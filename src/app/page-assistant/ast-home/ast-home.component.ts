import { Component, OnDestroy } from '@angular/core';
import { OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-assistant-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule
  ],
  templateUrl: './ast-home.component.html',
  styleUrls: ['./ast-home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AssistantHomeComponent implements OnDestroy {
  selectedIndex = 0;
  showDashboard = true; // hiển thị welcome/quick-actions khi true
  private sub?: Subscription;

  assistantName = 'Phạm Thị Mai';
  currentDate: Date = new Date();
  todayAppointments = 12;
  doctorsOnDuty = 8;
  pendingCheckIns = 5;

  constructor(private router: Router) {
    // sync lần đầu
    this.syncFromUrl(router.url);

    // subscribe navigation để cập nhật khi URL thay đổi
    this.sub = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.syncFromUrl(e.urlAfterRedirects);
      }
    });

    // cập nhật thời gian
    setInterval(() => this.currentDate = new Date(), 1000);
  }

  private syncFromUrl(url: string) {
    // nếu đang ở route con cụ thể -> ẩn dashboard
    if (url.includes('/assistant/doctor-schedule')) {
      this.selectedIndex = 0;
      this.showDashboard = false;
    } else if (url.includes('/assistant/patient-appointments')) {
      this.selectedIndex = 1;
      this.showDashboard = false;
    } else {
      // bao gồm /assistant hoặc /assistant/ hay /assistant/dashboard (nếu bạn add redirect)
      this.showDashboard = true;
      // chọn tab mặc định
      if (url.includes('/assistant/patient-appointments')) this.selectedIndex = 1;
      else this.selectedIndex = 0;
    }
  }

  onTabChange(index: number) {
    this.selectedIndex = index;
    if (index === 0) {
      this.router.navigate(['/assistant/doctor-schedule']);
    } else {
      this.router.navigate(['/assistant/patient-appointments']);
    }
  }

  navigateToSchedule() {
    this.router.navigate(['/assistant/doctor-schedule']);
  }

  navigateToAppointments() {
    this.router.navigate(['/assistant/patient-appointments']);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

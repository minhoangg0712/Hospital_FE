import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-assistant-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule
  ],
  template: `
    <mat-toolbar color="primary" class="topbar">
      <span class="title">Trợ lý phòng khám</span>
      <span class="spacer"></span>
      <button mat-icon-button aria-label="user"><mat-icon>support_agent</mat-icon></button>
    </mat-toolbar>

    <mat-card class="container">
      <mat-tab-group [selectedIndex]="selectedIndex" (selectedIndexChange)="onTabChange($event)">
        <mat-tab label="Lịch bác sĩ"></mat-tab>
        <mat-tab label="Lịch hẹn bệnh nhân"></mat-tab>
      </mat-tab-group>

      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </mat-card>
  `,
  styles: [`
    .topbar { position: sticky; top: 0; z-index: 1000; }
    .title { font-weight: 600; }
    .spacer { flex: 1 1 auto; }
    .container { margin: 16px; padding: 12px; }
    .content { margin-top: 12px; }
  `]
})
export class AssistantHomeComponent implements OnDestroy {
  selectedIndex = 0;
  private sub?: Subscription;

  constructor(private router: Router) {
    this.syncIndexFromUrl(router.url);
    this.sub = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.syncIndexFromUrl(e.urlAfterRedirects);
      }
    });
  }

  private syncIndexFromUrl(url: string) {
    if (url.includes('/assistant/patient-appointments')) this.selectedIndex = 1;
    else this.selectedIndex = 0;
  }

  onTabChange(index: number) {
    this.selectedIndex = index;
    if (index === 0) this.router.navigate(['assistant', 'doctor-schedule']);
    else this.router.navigate(['assistant', 'patient-appointments']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

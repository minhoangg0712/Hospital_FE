// src/app/pages/assistant/assistant-patient-appointments.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

export interface Appointment {
  id: number;
  patientName: string;
  doctor: string;
  datetime: string;
  status: 'scheduled'|'checked-in'|'cancelled';
}

const SAMPLE_APPS: Appointment[] = [
  { id: 1, patientName: 'Trần Văn X', doctor: 'Nguyễn Văn A', datetime: '2025-09-08 09:00', status: 'scheduled' },
  { id: 2, patientName: 'Nguyễn Thị Y', doctor: 'Lê Thị B', datetime: '2025-09-08 10:00', status: 'checked-in' },
  { id: 3, patientName: 'Lê Văn Z', doctor: 'Phạm C', datetime: '2025-09-09 14:30', status: 'scheduled' },
];

@Component({
  selector: 'app-assistant-patient-appointments',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-title>Lịch hẹn khám của bệnh nhân</mat-card-title>
      <mat-card-content>
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z1 full-width">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let r">{{ r.id }}</td>
          </ng-container>

          <ng-container matColumnDef="patientName">
            <th mat-header-cell *matHeaderCellDef>Bệnh nhân</th>
            <td mat-cell *matCellDef="let r">{{ r.patientName }}</td>
          </ng-container>

          <ng-container matColumnDef="doctor">
            <th mat-header-cell *matHeaderCellDef>Bác sĩ</th>
            <td mat-cell *matCellDef="let r">{{ r.doctor }}</td>
          </ng-container>

          <ng-container matColumnDef="datetime">
            <th mat-header-cell *matHeaderCellDef>Thời gian</th>
            <td mat-cell *matCellDef="let r">{{ r.datetime }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Trạng thái</th>
            <td mat-cell *matCellDef="let r">{{ r.status }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let r">
              <button mat-button (click)="onCheckIn(r)" [disabled]="r.status === 'checked-in'">Check-in</button>
              <button mat-button color="warn" (click)="onCancel(r)" [disabled]="r.status === 'cancelled'">Hủy</button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class AssistantPatientAppointmentsComponent {
  displayedColumns = ['id','patientName','doctor','datetime','status','actions'];
  dataSource = SAMPLE_APPS;

  onCancel(a: Appointment) {
    if (confirm(`Hủy lịch hẹn #${a.id} của ${a.patientName}?`)) {
      a.status = 'cancelled';
    }
  }

  onCheckIn(a: Appointment) {
    a.status = 'checked-in';
  }
}

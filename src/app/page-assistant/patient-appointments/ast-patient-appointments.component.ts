// src/app/page-assistant/patient-appointments/ast-patient-appointments.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

/**
 * Interface dữ liệu 1 lịch hẹn.
 * Sau này nếu chuyển sang gọi API thật, có thể thay bằng model trả về từ backend.
 */
export interface Appointment {
  id: number;
  patientName: string;
  doctor: string;
  datetime: string;
  status: 'scheduled' | 'checked-in' | 'cancelled';
}

/**
 * Dữ liệu giả lập tạm thời cho giao diện.
 * TODO: thay bằng service gọi API (AssistantService) khi backend sẵn sàng.
 */
const SAMPLE_APPS: Appointment[] = [
  { id: 1, patientName: 'Trần Văn X',   doctor: 'Nguyễn Văn A', datetime: '2025-09-08 09:00', status: 'scheduled' },
  { id: 2, patientName: 'Nguyễn Thị Y', doctor: 'Lê Thị B',     datetime: '2025-09-08 10:00', status: 'checked-in' },
  { id: 3, patientName: 'Lê Văn Z',     doctor: 'Phạm C',       datetime: '2025-09-09 14:30', status: 'scheduled' },
];

@Component({
  selector: 'app-assistant-patient-appointments',
  standalone: true,
  templateUrl: './ast-patient-appointments.component.html',
  styleUrls: ['./ast-patient-appointments.component.css'],
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule]
})
export class AssistantPatientAppointmentsComponent {
  displayedColumns = ['id', 'patientName', 'doctor', 'datetime', 'status', 'actions'];

  dataSource: Appointment[] = SAMPLE_APPS;

  onCancel(a: Appointment) {
    if (a.status === 'cancelled') return;
    const ok = confirm(`Hủy lịch hẹn #${a.id} của ${a.patientName}?`);
    if (ok) a.status = 'cancelled';
  }

  onCheckIn(a: Appointment) {
    if (a.status !== 'checked-in') a.status = 'checked-in';
  }
}

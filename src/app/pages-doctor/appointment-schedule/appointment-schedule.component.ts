import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AppointmentService, Appointment } from '../../services/appointment.service';

@Component({
  selector: 'app-appointment-schedule',
  templateUrl: './appointment-schedule.component.html',
  styleUrls: ['./appointment-schedule.component.css'],
  standalone: true,
  imports: [FullCalendarModule],
})
export class AppointmentScheduleComponent implements OnInit {
  events: any[] = [];

  calendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: this.events,
    slotMinTime: '08:00:00',
    slotMaxTime: '23:00:00',
    allDaySlot: false,
    dayMaxEventRows: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    eventColor: '#007bff',
    eventTextColor: 'white',
    eventClick: (info: any) => {
      this.handleEventClick(info.event);
    }
  };

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAppointmentsByDepartment().subscribe({
      next: (appointments: Appointment[]) => {
        this.events = appointments.map(appointment => ({
          id: appointment.id,
          title: `${appointment.patientName} - ${appointment.title}`,
          start: appointment.start,
          end: appointment.end,
          backgroundColor: this.getEventColor(appointment.status),
          extendedProps: appointment
        }));
        this.calendarOptions = { ...this.calendarOptions, events: this.events };
      },
      error: (error) => {
        console.error('Lỗi khi tải lịch hẹn:', error);
      }
    });
  }

  getEventColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ffc107';
      case 'confirmed':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#007bff';
    }
  }

  handleEventClick(event: any) {
    const appointment = event.extendedProps;
    // Hiển thị thông tin chi tiết lịch hẹn
    alert(`
      Bệnh nhân: ${appointment.patientName}
      Tiêu đề: ${appointment.title}
      Thời gian: ${new Date(appointment.start).toLocaleString()} - ${new Date(appointment.end).toLocaleString()}
      Trạng thái: ${appointment.status}
      ${appointment.description ? `Mô tả: ${appointment.description}` : ''}
    `);
  }
}

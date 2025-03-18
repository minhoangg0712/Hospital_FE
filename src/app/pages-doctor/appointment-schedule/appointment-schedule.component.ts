import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
interface EventData {
  title: string;
  start: string;
  end: string;
}

@Component({
  selector: 'app-appointment-schedule',
  templateUrl: './appointment-schedule.component.html',
  styleUrls: ['./appointment-schedule.component.css'],
  standalone: true,
  imports: [FullCalendarModule], // Import FullCalendarModule
})
export class AppointmentScheduleComponent {
  events: EventData[] = [];

  calendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: this.events,
    slotMinTime: '08:00:00', // Bắt đầu từ 8:00 AM
    slotMaxTime: '23:00:00', // Kết thúc lúc 16:40 PM
    allDaySlot: false,
    dayMaxEventRows: true, // Giữ gọn các sự kiện trong một hàng
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    eventColor: '#007bff', // Màu xanh dương cho các sự kiện
    eventTextColor: 'white',

  };

  constructor() {
    this.loadEvents();
  }

  loadEvents() {
    this.events = [
      { title: 'Khám bệnh A', start: '2025-03-17T09:00:00', end: '2025-03-17T10:00:00' },
      { title: 'Khám bệnh B', start: '2025-03-18T11:00:00', end: '2025-03-18T12:00:00' },
      { title: 'Khám bệnh C', start: '2025-03-13T13:00:00', end: '2025-03-13T14:00:00' },
      { title: 'Khám bệnh D', start: '2025-03-13T15:00:00', end: '2025-03-13T16:40:00' },
    ];
    this.calendarOptions = { ...this.calendarOptions, events: this.events };
  }
}

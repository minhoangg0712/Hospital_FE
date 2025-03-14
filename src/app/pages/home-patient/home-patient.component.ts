import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'

@Component({
  selector: 'app-home-patient',
  imports: [RouterModule],
  templateUrl: './home-patient.component.html',
  styleUrl: './home-patient.component.css'
})
export class HomePatientComponent {
  constructor(private router: Router) {}

  goToMedicine() {
    this.router.navigate(['/medicine']);
  }
}

export class AppointmentComponent {
  constructor(private router: Router) {}

  goToAppointment() {
    this.router.navigate(['/appointment']);
  }
}

export class CartComponent {
  constructor(private router: Router) {}

  goToAppointment() {
    this.router.navigate(['/cart']);
  }
}
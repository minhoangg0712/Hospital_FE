import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDoctorListComponent } from './admin-doctor-list.component';

describe('AdminDoctorListComponent', () => {
  let component: AdminDoctorListComponent;
  let fixture: ComponentFixture<AdminDoctorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDoctorListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDoctorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

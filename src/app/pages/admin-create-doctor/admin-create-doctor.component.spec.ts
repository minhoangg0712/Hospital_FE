import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateDoctorComponent } from './admin-create-doctor.component';

describe('AdminCreateDoctorComponent', () => {
  let component: AdminCreateDoctorComponent;
  let fixture: ComponentFixture<AdminCreateDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

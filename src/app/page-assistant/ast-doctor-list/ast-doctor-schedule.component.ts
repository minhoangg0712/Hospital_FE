import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AssistantFakeService, DoctorSchedule, Doctor } from '../../services/assistant-fake.service';
import { Observable, startWith, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-ast-doctor-schedule',
    templateUrl: './ast-doctor-schedule.component.html',
    styleUrls: ['./ast-doctor-schedule.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule
    ]
})

export class AstDoctorListComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    // ví dụ nhỏ:
    doctorCtrl = new FormControl<Doctor | string | null>(null);
    filteredDoctors$!: Observable<Doctor[]>;
    dataSource = new MatTableDataSource<DoctorSchedule>([]);
    allSchedules: DoctorSchedule[] = [];
    displayedColumns = ['id','doctorName','date','startTime','endTime','room'];

    constructor(private svc: AssistantFakeService) {}

    ngOnInit(): void {
        this.svc.getDoctors().subscribe(d => {
        this.filteredDoctors$ = this.doctorCtrl.valueChanges.pipe(
            startWith<Doctor | string | null>(''),
            map(val => typeof val === 'string' ? val : (val ? (val as Doctor).name : '')),
            map(name => d.filter(doc => doc.name.toLowerCase().includes((name||'').toLowerCase())))
        );
        });

        this.svc.getSchedules().subscribe(s => {
        this.allSchedules = s;
        this.dataSource.data = s;
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    displayDoctor(doctor: Doctor | string | null): string {
        return typeof doctor === 'string' ? doctor : (doctor ? doctor.name : '');
    }

    onDoctorSelected(selected: Doctor) {
        if (!selected) { this.dataSource.data = this.allSchedules; return; }
        this.dataSource.data = this.allSchedules.filter(s => s.doctorName.toLowerCase().includes(selected.name.toLowerCase()));
        this.paginator.firstPage();
    }

    applyFilter(text: string) {
        const t = (text||'').trim().toLowerCase();
        this.dataSource.data = t ? this.allSchedules.filter(s => s.doctorName.toLowerCase().includes(t)) : this.allSchedules;
        if (this.paginator) this.paginator.firstPage();
    }

    clearFilter() {
        this.doctorCtrl.setValue('');
        this.dataSource.data = this.allSchedules;
        if (this.paginator) this.paginator.firstPage();
    }
}

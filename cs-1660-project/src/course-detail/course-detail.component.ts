import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CourseStore } from '../stores/course.store';
import { CommonModule } from '@angular/common';
import { UserStore } from '../stores/user.store';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { StudentAttendanceDisplay } from '../types/student-attendance-display.type';
import { QrCodeComponent } from '../qr-code/qr-code.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    QrCodeComponent,
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent {
  // Changee Link 'Contentj' to QR Code
  pageLinks = ['QR Code', 'Gradebook'];
  activeLink = 'QR Code';
  readonly courseStore = inject(CourseStore);
  readonly userStore = inject(UserStore);
  course = this.courseStore.courseChosen;
  user = this.userStore.user;
  allStudents = this.userStore.studentsInCourse;
  allAttendance = this.userStore.courseAttendance;
  userAttendance = this.userStore.studentAttendance;
  allStudentInfoColumns = ['sid', 'name', 'totalAttendance'];
  attendanceToDisplay = computed<StudentAttendanceDisplay[]>(() => {
    if (this.user()?.isStudent) {
      return [];
    }

    let allStudentAttendance: StudentAttendanceDisplay[] = [];

    this.allStudents().forEach((s) => {
      const studentAttendance = this.userAttendance().filter(
        (a) => a.studentid === s.id
      );
      allStudentAttendance.push({
        id: s.id,
        firstName: s.firstName,
        middleInitial: s.middleInitial,
        lastName: s.lastName,
        totalAttendance: studentAttendance.length,
      });
    });
    return allStudentAttendance;
  });

  constructor(private route: ActivatedRoute) {
    if (this.user()?.isStudent) {
      this.userStore.loadStudentAttendance(this.user()?.id);
    } else {
      this.userStore.loadStudentsInCourse(this.course()?.courseid);
      this.userStore.loadAllAttendanceInCourse(this.course()?.courseid);
    }
  }

  async getQrCode() {
    const response = await fetch('/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Depending on where connecting database may need to send JSON to server side
      // json is data to be embedded
      // body: JSON.stringify(json)
    });

    const data = await response.json();
    console.log(data);
  }
}

// TODO: add QR Scanner component to course detail component & create event on scan
// To call API in backend to store the information scanned from the QR code
// NOTE: this functionality should only be available for STUDENTS
// i.e. SCAN FUNCTIONALITY WILL NOT BE AVAILABLE TO PROFESSOR ROLES

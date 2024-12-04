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

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent {
  pageLinks = ['Content', 'Gradebook'];
  activeLink = 'Content';
  readonly courseStore = inject(CourseStore);
  readonly userStore = inject(UserStore);
  course = this.courseStore.courseChosen;
  user = this.userStore.user;
  allStudents = this.userStore.studentsInCourse;
  allAttendence = this.userStore.courseAttendance;
  userAttendance = this.userStore.studentAttendance;
  allStudentInfoColumns = ['sid', 'name', 'totalAttendance'];
  attendanceToDisplay = computed<StudentAttendanceDisplay[]>(() => {
    if (this.user()?.isStudent) {
      return [];
    }

    let allStudentAttendance: StudentAttendanceDisplay[] = [];

    this.allStudents().forEach((s) => {
      const studentAttendance = this.allAttendence().filter(
        (a) => a.studentId === s.id
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
      this.userStore.loadStudentsInCourse(this.course()?.courseID);
      this.userStore.loadAllAttendanceInCourse(this.course()?.courseID);
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

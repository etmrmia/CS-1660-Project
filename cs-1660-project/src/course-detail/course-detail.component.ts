import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CourseStore } from '../stores/course.store';
import { NgIf } from '@angular/common';
import { UserStore } from '../stores/user.store';
import { Attendance } from '../types/attendance.type';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [MatTabsModule, NgIf, MatDividerModule, MatListModule],
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
  attendance = this.userStore.studentAttendance;
  displayedColumns = ['date', 'grade'];
  gradesToDisplay = computed<Attendance[]>(() => {
    if (this.user()?.isStudent) {
      return this.attendance().filter(
        (g) =>
          g.courseId === this.course()?.courseID &&
          g.studentId === this.user()?.id
      );
    }
    return this.attendance().filter(
      (g) => g.courseId === this.course()?.courseID
    );
  });

  constructor(private route: ActivatedRoute) {
    if (this.user()?.isStudent) {
      this.userStore.loadStudentAttendance(this.user()?.id);
    }
  }
}

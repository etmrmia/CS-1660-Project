import { Component, inject } from '@angular/core';
import { CourseBlockComponent } from '../course-block/course-block.component';
import { NgFor } from '@angular/common';
import { CourseBlockInfo } from '../types/course-block-info.type';
import { MatButtonModule } from '@angular/material/button';
import { CourseStore } from '../stores/course.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CourseBlockComponent, NgFor, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // TODO: Get user information (includes if user is a student or a professor)
  isStudent = true;
  readonly courseStore = inject(CourseStore);
  courses = this.courseStore.courses;

  addCourse() {
    //TODO: Implement add course
  }
}

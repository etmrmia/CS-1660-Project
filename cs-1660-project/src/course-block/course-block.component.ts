import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { CourseStore } from '../stores/course.store';
import { Course } from '../types/course.type';
@Component({
  selector: 'app-course-block',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './course-block.component.html',
  styleUrl: './course-block.component.scss',
})
export class CourseBlockComponent {
  course = input<Course>();
  readonly courseStore = inject(CourseStore);

  constructor(private router: Router) {}

  navigateToCourse() {
    this.courseStore.setCourse(this.course());
    this.router.navigate(['/course', this.course()?.courseID]);
  }
}

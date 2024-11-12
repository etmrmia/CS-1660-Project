import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CourseBlockInfo } from '../types/course-block-info.type';
import { Router } from '@angular/router';
import { CourseStore } from '../stores/course.store';
@Component({
  selector: 'app-course-block',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './course-block.component.html',
  styleUrl: './course-block.component.scss',
})
export class CourseBlockComponent {
  course = input<CourseBlockInfo>();
  readonly courseStore = inject(CourseStore);

  constructor(private router: Router) {}

  navigateToCourse() {
    this.courseStore.setCourse(this.course());
    this.router.navigate(['/course', this.course()?.code]);
  }
}

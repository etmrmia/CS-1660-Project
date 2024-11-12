import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CourseBlockInfo } from '../types/course-block-info.type';
import { Router } from '@angular/router';
@Component({
  selector: 'app-course-block',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './course-block.component.html',
  styleUrl: './course-block.component.scss',
})
export class CourseBlockComponent {
  course = input<CourseBlockInfo>();

  constructor(private router: Router) {}

  navigateToCourse(code: number | undefined) {
    console.log('code: ' + code);
    if (code) {
      this.router.navigate(['/course', code]);
    }
  }
}

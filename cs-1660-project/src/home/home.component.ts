import { Component, inject } from '@angular/core';
import { CourseBlockComponent } from '../course-block/course-block.component';
import { NgFor } from '@angular/common';
import { CourseBlockInfo } from '../types/course-block-info.type';
import { MatButtonModule } from '@angular/material/button';
import { CourseStore } from '../stores/course.store';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CourseBlockComponent, NgFor, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly courseStore = inject(CourseStore);
  readonly userStore = inject(UserStore);
  courses = this.courseStore.courses;
  user = this.userStore.user;
}

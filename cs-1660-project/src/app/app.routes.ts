import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { CourseDetailComponent } from '../course-detail/course-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'course/:code',
    component: CourseDetailComponent,
  },
];

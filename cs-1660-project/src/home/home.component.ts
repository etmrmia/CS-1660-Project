import { Component } from '@angular/core';
import { CourseBlockComponent } from '../course-block/course-block.component';
import { NgFor } from '@angular/common';
import { CourseBlockInfo } from '../types/course-block-info.type';
import { MatButtonModule } from '@angular/material/button';

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
  courses: CourseBlockInfo[] = [
    {
      courseName: 'Cloud Computing',
      courseNo: 'CS 1660',
      instructor: 'Dan Mahoney',
      term: 'Fall 2024',
      code: 1,
    },
    {
      courseName: 'Database Management Systems',
      courseNo: 'CS 1555',
      instructor: 'Brian Nixon',
      term: 'Spring 2024',
      code: 2,
    },
    {
      courseName: 'Machine Learning',
      courseNo: 'CS 1675',
      instructor: 'Patrick Skeba',
      term: 'Fall 2023',
      code: 3,
    },
    {
      courseName: 'Cloud Computing',
      courseNo: 'CS 1660',
      instructor: 'Dan Mahoney',
      term: 'Fall 2024',
      code: 1,
    },
    {
      courseName: 'Database Management Systems',
      courseNo: 'CS 1555',
      instructor: 'Brian Nixon',
      term: 'Spring 2024',
      code: 2,
    },
    {
      courseName: 'Machine Learning',
      courseNo: 'CS 1675',
      instructor: 'Patrick Skeba',
      term: 'Fall 2023',
      code: 3,
    },
    {
      courseName: 'Cloud Computing',
      courseNo: 'CS 1660',
      instructor: 'Dan Mahoney',
      term: 'Fall 2024',
      code: 1,
    },
    {
      courseName: 'Database Management Systems',
      courseNo: 'CS 1555',
      instructor: 'Brian Nixon',
      term: 'Spring 2024',
      code: 2,
    },
    {
      courseName: 'Machine Learning',
      courseNo: 'CS 1675',
      instructor: 'Patrick Skeba',
      term: 'Fall 2023',
      code: 3,
    },
    {
      courseName: 'Cloud Computing',
      courseNo: 'CS 1660',
      instructor: 'Dan Mahoney',
      term: 'Fall 2024',
      code: 1,
    },
    {
      courseName: 'Database Management Systems',
      courseNo: 'CS 1555',
      instructor: 'Brian Nixon',
      term: 'Spring 2024',
      code: 2,
    },
    {
      courseName: 'Machine Learning',
      courseNo: 'CS 1675',
      instructor: 'Patrick Skeba',
      term: 'Fall 2023',
      code: 3,
    },
    {
      courseName: 'Cloud Computing',
      courseNo: 'CS 1660',
      instructor: 'Dan Mahoney',
      term: 'Fall 2024',
      code: 1,
    },
    {
      courseName: 'Database Management Systems',
      courseNo: 'CS 1555',
      instructor: 'Brian Nixon',
      term: 'Spring 2024',
      code: 2,
    },
    {
      courseName: 'Machine Learning',
      courseNo: 'CS 1675',
      instructor: 'Patrick Skeba',
      term: 'Fall 2023',
      code: 3,
    },
    {
      courseName: 'Cloud Computing',
      courseNo: 'CS 1660',
      instructor: 'Dan Mahoney',
      term: 'Fall 2024',
      code: 1,
    },
    {
      courseName: 'Database Management Systems',
      courseNo: 'CS 1555',
      instructor: 'Brian Nixon',
      term: 'Spring 2024',
      code: 2,
    },
    {
      courseName: 'Machine Learning',
      courseNo: 'CS 1675',
      instructor: 'Patrick Skeba',
      term: 'Fall 2023',
      code: 3,
    },
    {
      courseName: 'Cloud Computing',
      courseNo: 'CS 1660',
      instructor: 'Dan Mahoney',
      term: 'Fall 2024',
      code: 1,
    },
    {
      courseName: 'Database Management Systems',
      courseNo: 'CS 1555',
      instructor: 'Brian Nixon',
      term: 'Spring 2024',
      code: 2,
    },
    {
      courseName: 'Machine Learning',
      courseNo: 'CS 1675',
      instructor: 'Patrick Skeba',
      term: 'Fall 2023',
      code: 3,
    },
    {
      courseName: 'Cloud Computing',
      courseNo: 'CS 1660',
      instructor: 'Dan Mahoney',
      term: 'Fall 2024',
      code: 1,
    },
    {
      courseName: 'Database Management Systems',
      courseNo: 'CS 1555',
      instructor: 'Brian Nixon',
      term: 'Spring 2024',
      code: 2,
    },
    {
      courseName: 'Machine Learning',
      courseNo: 'CS 1675',
      instructor: 'Patrick Skeba',
      term: 'Fall 2023',
      code: 3,
    },
  ];

  addCourse() {
    //TODO: Implement add course
  }
}

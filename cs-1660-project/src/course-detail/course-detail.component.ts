import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseBlockInfo } from '../types/course-block-info.type';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent implements OnInit {
  course: CourseBlockInfo | undefined;
  code: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const code = params.get('code');
      // Load course information depending on course number
      if (code) {
        this.getCourseInformation();
      }
    });
  }

  getCourseInformation() {
    // TODO: Implement getting course info from database
    this.course = {
      courseName: 'Cloud Computing',
      courseNo: 'CS 1660',
      instructor: 'Dan Mahoney',
      term: 'Fall 2024',
      code: this.code,
    };
  }
}

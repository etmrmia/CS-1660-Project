import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseBlockInfo } from '../types/course-block-info.type';
import { MatTabsModule } from '@angular/material/tabs';
import { CourseStore } from '../stores/course.store';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [MatTabsModule, NgIf],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent {
  pageLinks = ['Content', 'Gradebook'];
  activeLink = 'Content';
  readonly courseStore = inject(CourseStore);
  course = this.courseStore.courseChosen;

  constructor(private route: ActivatedRoute) {}

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe((params) => {
  //     const code = params.get('code');
  //     // Load course information depending on course number
  //     if (code) {
  //       this.getCourseInformation();
  //     }
  //   });
  // }

  getCourseInformation() {
    // TODO: Implement getting course info from database
    // this.course = {
    //   courseName: 'Cloud Computing',
    //   courseNo: 'CS 1660',
    //   instructor: 'Dan Mahoney',
    //   term: 'Fall 2024',
    //   code: this.code,
    // };
  }

    async getQrCode() {
      const response = await fetch("/data", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        // Depending on where connecting database may need to send JSON to server side
        // json is data to be embedded
        // body: JSON.stringify(json)
      });

      const data = await response.json();
      console.log(data);
    }
}

import { Injectable, Inject, Optional } from '@angular/core';
import { User } from '../types/user.type';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    @Inject('formEmail') @Optional() public formEmail?: string,
    @Inject('formPassword') @Optional() public formPassword?: string,
    @Inject('userId') @Optional() public userId?: number,
    @Inject('courseId') @Optional() public courseId?: string,
    @Inject('sectionNo') @Optional() public sectionNo?: number
  ) {
    this.formEmail = formEmail || '';
    this.formPassword = formPassword || '';
    this.userId = userId || 0;
  }

  /**
   * User type used to return User Type.
   */
  user: User = {
    id: 0,
    firstName: '',
    middleInitial: null,
    lastName: '',
    email: '',
    isStudent: true,
  };

  /**
   * Add formEmail and formPassword in constructor.
   * Calls database to check user based on password and email entered.
   * Returns User Type or undefined if user doesn't exist.
   */
  async getUserFromLogin() {
    const response = await fetch('/authuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.formEmail,
        password: this.formPassword,
      }),
    });
    console.log(response);
    const data = await response.json();

    if (!data['exists']) {
      return undefined;
    }

    if (this.formEmail) {
      this.user.email = this.formEmail;
    }
    this.user.id = data['id'];
    this.user.firstName = data['firstName'];
    this.user.lastName = data['lastName'];
    this.user.isStudent = data['isStudentValue'];
    return this.user;
  }

  /**
   * Add a user id when initializing service
   * Takes a user id and returns a list of classes and attendance
   * List should have rows organized as { attendance_count, course_name }.
   */
  async getAttendanceForUser() {
    const response = await fetch('/userattendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId: this.userId }),
    });
    const data = await response.json();
    if (data === undefined || data['attendanceRows'] === undefined) {
      return undefined;
    }
    return data['attendanceRows']['rows'];
  }

  /**
   * Add a user id when initializing service
   * Takes a user id and returns a list of classes and attendance
   * List should have rows organized as { attendance_count, course_name }.
   */
  async getAttendanceForCourse() {
    const response = await fetch('/courseattendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId: this.courseId,
        sectionNo: this.sectionNo,
      }),
    });
    const data = await response.json();
    if (data === undefined || data['courseAttendanceRows'] === undefined) {
      console.log('undefined');
      return undefined;
    }
    console.log('data for new attendance course:');
    console.log(data);
    return data['courseAttendanceRows']['rows'];
  }

  /**
   * Add a user id when initializing service
   * Takes a user id and returns list of courses user attends
   * List should have rows organized as { course_id, course_name }
   */
  async getCoursesForStudent() {
    const response = await fetch('/studentcourses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId: this.userId }),
    });
    const data = await response.json();
    if (data === undefined || data['courseRows'] === undefined) {
      return undefined;
    }
    return data['courseRows']['rows'];
  }

  /**
   * Add a user id when initializing service
   * Takes a user id and returns list of courses user teaches
   * List should have rows organized as { section_no, course_id, course_name }
   */
  async getCoursesForProfessor() {
    const response = await fetch('/professorsections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ professorID: this.userId }),
    });
    const data = await response.json();
    if (data === undefined || data['courseRows'] === undefined) {
      return undefined;
    }
    return data['courseRows']['rows'];
  }

  /**
   * Add a course id when initializing service
   * Takes a course id and returns list of users in course
   */
  async getStudentsInCourse() {
    const response = await fetch('/usersincourse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseID: this.courseId }),
    });
    const data = await response.json();
    if (data === undefined || data['studentList'] === undefined) {
      return undefined;
    }
    return data['studentList']['rows'];
  }
}

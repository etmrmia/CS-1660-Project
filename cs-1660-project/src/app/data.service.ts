import { Injectable, Inject, Optional } from '@angular/core';
import { User } from '../types/user.type';

/**
 * Hi Emma! This is Alex from the past speaking...
 * I tried to make this service as self documenting as possible
 * and please enjoy the fact that I made every function javadoc like
 * so you could see descriptions as you are typing out function names.
 * 
 * WHAT NEEDS DONE: connecting the pieces (and low key testing should
 * only be a syntax error but if it's a problem with server side it will
 * tell you in the console - believe me it was yelling at me a lot today).
 * I also did not reference service anywhere - I didn't wanna assume where
 * you'd use it on 2AM brain.
 * 
 * Also I did run the queries through a postgresql simulator so there
 * shouldn't be any issues there (if there is idek wtf you do)
 * 
 * GOOD LUCK and hopefully you got some sleep :).
 */

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    @Inject('formEmail') @Optional() public formEmail?: string,
    @Inject('formPassword') @Optional() public formPassword?: string,
    @Inject('userId') @Optional() public userId?: number,
    @Inject('courseId') @Optional() public courseId?: string
  ) { 
    this.formEmail = formEmail || '';
    this.formPassword = formPassword || '';
    this.userId = userId || 0;
  }

  /**
   * User type used to return User Type.
  */
  user : User = {
    id: 0,
    firstName: '',
    middleInitial: null,
    lastName: '',
    email: '',
    isStudent: true
  };

  /**
   * Add formEmail and formPassword in constructor.
   * Calls database to check user based on password and email entered.
   * Returns User Type or empty object if user doesn't exist.
  */
  async getUserFromLogin() {
    const response = await fetch('/authuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email : this.formEmail,
                            password : this.formPassword }),
    });
    const data = await response.json();

    if (!data['exists']) {
      return {};
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
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({ studentId : this.userId }),
    });
    const data = await response.json();

    return data["attendanceRows"];
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
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({ studentId : this.userId }),
    });
    const data = await response.json();

    return data["courseRows"];
  }

  /**
   * Add a course id when initializing service
   * Takes a course id and returns list of users in course
  */
  async getStudentsInCourse() {
    const response = await fetch('/usersincourse', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({ courseID : this.courseId }),
    });
    const data = await response.json();

    return data["studentList"];
  }
}
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { User } from '../types/user.type';
import { Attendance } from '../types/attendance.type';
import { inject } from '@angular/core';
import { DataService } from '../app/data.service';
import { CourseAttendance } from '../types/course-attendance.type';
import { BasicStudent } from '../types/basic-student.type';

type UserState = {
  user: User | undefined;
  isLoading: boolean;
  studentsInCourse: BasicStudent[];
  studentAttendance: Attendance[];
  courseAttendance: CourseAttendance[];
};

const initialState: UserState = {
  user: undefined,
  isLoading: false,
  studentsInCourse: [],
  studentAttendance: [],
  courseAttendance: [],
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, dataService = inject(DataService)) => ({
    async loadUserInfo(
      email: string,
      password: string
    ): Promise<User | undefined> {
      patchState(store, (state) => ({
        isLoading: true,
      }));
      dataService.formEmail = email;
      dataService.formPassword = password;
      const user = await dataService.getUserFromLogin();
      patchState(store, { user: user, isLoading: false });
      return user;
    },
    async loadStudentsInCourse(courseCode: string): Promise<User[]> {
      patchState(store, (state) => ({
        isLoading: true,
      }));
      dataService.courseId = courseCode;
      const studentsInCourse = await dataService.getStudentsInCourse();
      console.log(studentsInCourse);
      patchState(store, (state) => ({
        studentsInCourse: studentsInCourse,
        isLoading: false,
      }));
      return studentsInCourse;
    },
    async loadAllAttendanceInCourse(
      courseCode: string,
      sectionNo: number
    ): Promise<CourseAttendance[]> {
      patchState(store, (state) => ({
        isLoading: true,
      }));
      dataService.courseId = courseCode;
      dataService.sectionNo = sectionNo;
      const courseAttendance = await dataService.getAttendanceForCourse();
      console.log(courseAttendance);
      patchState(store, (state) => ({
        courseAttendance: courseAttendance,
        isLoading: false,
      }));
      return courseAttendance;
    },
    async loadStudentAttendance(sid: number): Promise<void> {
      patchState(store, (state) => ({
        isLoading: true,
      }));
      dataService.userId = sid;
      const attendance = await dataService.getAttendanceForUser();
      patchState(store, { studentAttendance: attendance, isLoading: false });
    },
    logout(): void {
      patchState(store, (state) => ({
        user: undefined,
      }));
    },
  }))
);

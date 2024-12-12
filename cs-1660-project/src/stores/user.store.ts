import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { User } from '../types/user.type';
import { Attendance } from '../types/attendance.type';
import { inject } from '@angular/core';
import { DataService } from '../app/data.service';

type UserState = {
  user: User | undefined;
  isLoading: boolean;
  studentsInCourse: User[];
  studentAttendance: Attendance[];
  courseAttendance: Attendance[];
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
    async loadStudentsInCourse(courseCode: string | undefined): Promise<void> {
      patchState(store, (state) => ({
        isLoading: true,
      }));
      dataService.courseId = courseCode;
      const studentsInCourse = await dataService.getStudentsInCourse();
      patchState(store, (state) => ({
        studentsInCourse: studentsInCourse,
        isLoading: false,
      }));
    },
    loadAllAttendanceInCourse(courseCode: string | undefined): void {
      patchState(store, (state) => ({
        isLoading: true,
      }));
      dataService.courseId = courseCode;
      patchState(store, (state) => ({
        //   courseAttendance: [
        //     {
        //       sectionNo: 2,
        //       courseId: 'CS 1660',
        //       studentId: 1,
        //       attendanceDate: new Date(2020, 4, 3),
        //     },
        //     {
        //       sectionNo: 2,
        //       courseId: 'CS 1660',
        //       studentId: 1,
        //       attendanceDate: new Date(2020, 4, 4),
        //     },
        //     {
        //       sectionNo: 2,
        //       courseId: 'CS 1660',
        //       studentId: 1,
        //       attendanceDate: new Date(2020, 4, 5),
        //     },
        //   ],
      }));
    },
    async loadStudentAttendance(sid: number | undefined): Promise<void> {
      patchState(store, (state) => ({
        isLoading: true,
      }));
      dataService.userId = sid;
      const attendance = await dataService.getAttendanceForUser();
      console.log(attendance);
      patchState(store, { studentAttendance: attendance, isLoading: false });
    },
    logout(): void {
      patchState(store, (state) => ({
        user: undefined,
      }));
    },
  }))
);

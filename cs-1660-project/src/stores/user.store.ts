import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { User } from '../types/user.type';
import { Attendance } from '../types/attendance.type';

type UserState = {
  user: User | undefined;
  isLoading: boolean;
  studentsInCourse: User[];
  studentAttendance: Attendance[];
};

const initialState: UserState = {
  user: undefined,
  isLoading: false,
  studentsInCourse: [],
  studentAttendance: [],
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    loadUserInfo(): void {
      patchState(store, (state) => ({
        user: {
          id: 1233,
          isStudent: true,
          firstName: 'John',
          lastName: 'Smith',
          middleInitial: 'T',
        },
      }));
    },
    loadStudentsInCourse(courseCode: number | undefined): void {
      patchState(store, (state) => ({
        studentsInCourse: [
          {
            id: 1233,
            isStudent: true,
            firstName: 'John',
            lastName: 'Smith',
            middleInitial: 'T',
          },
          {
            id: 1432,
            isStudent: true,
            firstName: 'Tiffany',
            lastName: 'Star',
            middleInitial: 'A',
          },
          {
            id: 1233,
            isStudent: true,
            firstName: 'Joanie',
            lastName: 'Schneider',
            middleInitial: 'M',
          },
          {
            id: 1233,
            isStudent: true,
            firstName: 'Larry',
            lastName: 'Lu',
            middleInitial: 'T',
          },
          {
            id: 1233,
            isStudent: true,
            firstName: 'Susie',
            lastName: 'Smith',
            middleInitial: 'T',
          },
        ],
      }));
    },
    loadStudentAttendance(sid: number | undefined): void {
      patchState(store, (state) => ({
        studentAttendance: [
          {
            sectionNo: 2,
            courseId: 'CS 1660',
            studentId: 1,
            attendanceDate: new Date(2020, 4, 3),
          },
          {
            sectionNo: 2,
            courseId: 'CS 1660',
            studentId: 1,
            attendanceDate: new Date(2020, 4, 4),
          },
          {
            sectionNo: 2,
            courseId: 'CS 1660',
            studentId: 1,
            attendanceDate: new Date(2020, 4, 5),
          },
        ],
      }));
    },
  })),
  withHooks({
    onInit(store) {
      store.loadUserInfo();
    },
  })
);

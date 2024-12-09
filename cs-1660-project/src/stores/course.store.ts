import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CourseBlockInfo } from '../types/course-block-info.type';
import { computed } from '@angular/core';
import { Course } from '../types/course.type';

type CourseState = {
  courses: Course[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
  courseChosen: Course | undefined;
};

const initialState: CourseState = {
  courses: [],
  isLoading: false,
  filter: { query: '', order: 'desc' },
  courseChosen: undefined,
};

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ courses, filter }) => ({
    sortedCourses: computed(() => {
      const direction = filter.order() === 'asc' ? 1 : -1;

      return courses().sort(
        (a, b) => direction * a.courseName.localeCompare(b.courseName)
      );
    }),
  })),
  withMethods((store) => ({
    setOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },
    setCourse(course: Course | undefined): void {
      patchState(store, (state) => ({ courseChosen: course }));
    },
    loadCourses(id: number, isStudent: boolean): void {
      patchState(store, (state) => ({
        courses: [
          {
            courseName: 'Cloud Computing',
            courseID: 'CS 1660',
            professor: {
              id: 1,
              firstName: 'Dan',
              lastName: 'Mahoney',
              isStudent: false,
            },
            sectionNo: 1,
          },
          {
            courseName: 'Database Management Systems',
            courseID: 'CS 1555',
            professor: {
              id: 2,
              firstName: 'Brian',
              lastName: 'Nixon',
              isStudent: false,
            },
            sectionNo: 2,
          },
          {
            courseName: 'Machine Learning',
            courseID: 'CS 1675',
            professor: {
              id: 3,
              firstName: 'Patrick',
              lastName: 'Skeba',
              isStudent: false,
            },
            sectionNo: 4,
          },
        ],
      }));
    },
  })),
  withHooks({
    onInit(store) {
      store.loadCourses(1, true);
    },
  })
);

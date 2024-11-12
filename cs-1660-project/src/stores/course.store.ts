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

type CourseState = {
  courses: CourseBlockInfo[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
  courseChosen: CourseBlockInfo | undefined;
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
    setCourse(course: CourseBlockInfo | undefined): void {
      patchState(store, (state) => ({ courseChosen: course }));
    },
    loadCourses(): void {
      patchState(store, (state) => ({
        courses: [
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
        ],
      }));
    },
  })),
  withHooks({
    onInit(store) {
      store.loadCourses();
    },
  })
);

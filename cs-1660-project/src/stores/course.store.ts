import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CourseBlockInfo } from '../types/course-block-info.type';
import { computed, inject } from '@angular/core';
import { Course } from '../types/course.type';
import { DataService } from '../app/data.service';

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
  withMethods((store, dataService = inject(DataService)) => ({
    setOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },
    setCourse(course: Course | undefined): void {
      patchState(store, (state) => ({ courseChosen: course }));
    },
    async loadCourses(id: number, isStudent: boolean): Promise<void> {
      patchState(store, (state) => ({
        isLoading: true,
      }));
      dataService.userId = id;
      let userCourses = [];
      if (isStudent) {
        userCourses = await dataService.getCoursesForStudent();
      } else {
        userCourses = await dataService.getCoursesForProfessor();
      }

      patchState(store, (state) => ({
        courses: userCourses,
        isLoading: false,
      }));
    },
  })),
  withHooks({
    onInit(store) {
      store.loadCourses(1, true);
    },
  })
);

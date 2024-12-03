import { User } from "./user.type";

export type Course = {
  courseID: string;
  courseName: string;
  sectionNo: number;
  professor: User;
};

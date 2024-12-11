export type User = {
  id: number;
  firstName: string;
  middleInitial?: string | null;
  lastName: string;
  email: string;
  isStudent: boolean;
};
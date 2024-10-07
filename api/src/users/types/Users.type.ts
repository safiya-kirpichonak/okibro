export type Users = {
  id: string;
  name: string;
  email: string;
  imageURL: string;
  isActive: boolean;
  role: {
    name: string;
  };
  completedLessonsCount: number;
};

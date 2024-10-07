export type User = {
  id: string;
  name: string;
  email: string;
  imageURL: string;
  credits: number;
  createdAt: Date;
  role: {
    name: string;
  };
  completedLessonsCount: number;
};

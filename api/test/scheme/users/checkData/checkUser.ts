export const checkUser = {
  id: expect.any(String),
  name: expect.any(String),
  email: expect.any(String),
  imageURL: null,
  credits: expect.any(Number),
  createdAt: expect.any(String),
  completedLessonsCount: expect.any(Number),
  role: {
    name: expect.any(String),
  },
};

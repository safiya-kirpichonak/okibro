export const checkListOfUsers = expect.arrayContaining([
  {
    id: expect.any(String),
    name: expect.any(String),
    email: expect.any(String),
    imageURL: null,
    isActive: expect.any(Boolean),
    completedLessonsCount: expect.any(Number),
    role: {
      name: expect.any(String),
    },
  },
]);

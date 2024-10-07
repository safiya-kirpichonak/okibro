export const checkListOfPrompts = expect.arrayContaining([
  {
    id: expect.any(Number),
    code: expect.any(String),
    content: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
]);

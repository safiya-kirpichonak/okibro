export const checkListOfRoles = expect.arrayContaining([
  {
    count: expect.any(Number),
    name: expect.any(String),
  },
]);

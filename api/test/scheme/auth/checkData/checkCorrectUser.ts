export const checkCorrectUser = {
  id: expect.any(String),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  roleId: expect.any(String),
  name: expect.any(String),
  credits: expect.any(Number),
  email: 'example@gmail.com',
  password: expect.any(String),
  refreshToken: null,
  isActive: false,
  imageURL: null,
  managementLink: expect.any(String),
};

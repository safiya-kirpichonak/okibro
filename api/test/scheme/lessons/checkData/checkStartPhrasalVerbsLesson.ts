export const checkStartPhrasalVerbsLesson = {
  id: expect.any(Number),
  status: expect.any(String),
  history: expect.any(Array),
  userId: expect.any(String),
  lessonStructureId: expect.any(Number),
  settings: {
    isSecondPartStarted: expect.any(Boolean),
    phrasalVerbs: [expect.any(String)],
    startTime: expect.any(Number),
  },
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
};

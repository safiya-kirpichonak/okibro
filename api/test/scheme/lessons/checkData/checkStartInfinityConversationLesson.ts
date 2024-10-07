export const checkStartInfinityConversationLesson = {
  id: expect.any(Number),
  status: expect.any(String),
  history: expect.any(Array),
  userId: expect.any(String),
  lessonStructureId: expect.any(Number),
  settings: { conversationTime: expect.any(Number) },
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
};

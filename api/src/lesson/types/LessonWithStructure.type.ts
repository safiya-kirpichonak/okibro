export type LessonWithStructure = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  history: any;
  settings: any;
  userId: string;
  lessonStructureId: number;
  lessonStructure: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    credits: number;
    structure: any;
  };
};

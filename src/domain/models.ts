export type Category = 'Corte' | 'Hemostasia' | 'Sutura';
export type AreaId = 'medicine' | 'science' | 'other';
export type Lesson = {
  id: string;
  title: string;
  area: AreaId;
  subject: string;
  summary: string;
  keywords: string[];
  minutes: number;
  sections: { title: string; text: string }[];
  instrumentIds: string[];
  sources: { title: string; url: string }[];
  questions: { id: string; prompt: string; answer: string; distractors: string[]; explanation: string }[];
};
export type Photo = {
  asset: number;
  author: string;
  source: string;
  license: string;
  licenseUrl: string;
};
export type Instrument = {
  id: string;
  name: string;
  aliases: string[];
  category: Category;
  summary: string;
  recognition: string[];
  hint: string;
  photo: Photo;
  sources: { title: string; url: string }[];
};
export type CustomCard = { id: string; front: string; back: string };
export type StudyTopic = {
  id: string;
  title: string;
  description: string;
  instrumentIds: string[];
  // Optional so libraries saved before the lesson catalog remain readable.
  lessonIds?: string[];
  notes: string;
  cards: CustomCard[];
};
export type Review = { attempts: number; correct: number; lastCorrect: boolean; updatedAt: string };
export type StudyState = {
  version: 1;
  topics: StudyTopic[];
  reviews: Record<string, Review>;
  sessions: number;
};
export type StudyCard = { id: string; front: string; back: string; instrumentId?: string; lessonId?: string; area?: AreaId; answer?: string; options?: string[] };

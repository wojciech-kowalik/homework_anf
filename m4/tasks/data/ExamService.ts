import { Exam, getExam } from "../../../api/exams";
import { AnswerData } from './types';

export interface ExamService {
  fetchExam(): Promise<Exam>;
  createExamAnswers(examId: string, payload: AnswerData): Promise<Response>;
}

export class MockExamService implements ExamService {
  fetchExam = jest.fn();
  createExamAnswers = jest.fn();
}

export const DefaultExamService: ExamService = {
  async fetchExam(): Promise<Exam> {
    return getExam("a");
  },
  async createExamAnswers(examId: string, payload: AnswerData): Promise<Response> {
    return fetch(`http://localhost:3000/exams/${examId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
};

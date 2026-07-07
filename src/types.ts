export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  theory: string;
  icon: string; // Icon identifier
  quizId?: string;
  color: string;
}

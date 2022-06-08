import React, { createContext, useEffect, useState } from "react";

import { Exam } from "api/exams";
import { DefaultExamService, ExamService } from "../data/ExamService";

interface ExamTaskContextValue {
  exam?: Exam;
}

export const ExamContext = createContext<ExamTaskContextValue | undefined>(
  undefined
);

interface ExamProviderProps {
  service?: ExamService;
}

export const ExamProvider: React.FC<ExamProviderProps> = (props) => {
  const { service = DefaultExamService } = props;

  const [exam, setExam] = useState<Exam>();
  useEffect(() => {
    service.fetchExam().then(setExam);
  }, [service]);

  return (
    <ExamContext.Provider value={{ exam }}>
      {props.children}
    </ExamContext.Provider>
  );
};

import { useContext } from "react";

import { ExamContext } from "./ExamProvider";

export const useExam = () => {
  const ctx = useContext(ExamContext);

  if (!ctx) {
    throw new Error("Component beyond ExamContext!");
  }

  return ctx.exam;
};

import React, { useCallback, useState } from "react";

import { Button, Typography } from "ui/atoms";
import { ButtonList } from "ui/molecules";
import { ExamTask } from "api/exams";
import { ChoiceTaskView } from "./ChoiceTaskView";
import { TextTaskView } from "./TextTaskView";
import { RichtextTaskView } from "./RichtextTaskView";
import { Exam } from '../../api/exams';
import { AnswerData } from './data/types';

interface Props {
  exam: Exam;
  selected: number;
  onClick: () => void;
  onUpdate: (payload: AnswerData | null) => Promise<Response>;
}

export const TaskView: React.FC<Props> = ({ exam, selected, onClick, onUpdate }) => {
  const {userId, tasks} = exam;
  const [answerData, setAnswerData] = useState<AnswerData | null>(null);
  const selectedTask = tasks[selected - 1];

  const updateDataCallback = useCallback(
    (taskId: AnswerData["taskId"], answer: AnswerData["answer"]) => {
      setAnswerData({ taskId, userId, answer });
    },
    [userId]
  );

  const factoryComponent = (task: ExamTask) => {
    switch (task.type) {
      case "TEXT":
        return <TextTaskView onAnswerChange={updateDataCallback} task={task} />;

      case "RICHTEXT":
        return <RichtextTaskView onAnswerChange={updateDataCallback} task={task} />;

      case "CHOICE":
        return <ChoiceTaskView onAnswerChange={updateDataCallback} task={task} />;

      default:
        break;
    }
  };

  return (
    <>
      <Typography variant="h1">
        Question {selected} of {tasks.length}
      </Typography>
      {factoryComponent(selectedTask)}
      <ButtonList align="center">
        <Button onClick={() => {onUpdate(answerData).then(onClick)}} variant="PRIMARY">
          Next question
        </Button>
      </ButtonList>
    </>
  );
};

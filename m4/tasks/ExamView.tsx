import React, { useCallback, useState } from "react";

import { Button } from "ui/atoms";
import { ButtonList } from "ui/molecules";
import { Panel } from "ui/layout";

import { Exam } from "api/exams";
import { WelcomeView } from "./WelcomeView";
import { ExitView } from "./ExitView";
import { TaskView } from "./TaskView";
import { AnswerData } from "./data/types";
import { DefaultExamService } from "./data/ExamService";

export const ExamView: React.FC<{ exam: Exam }> = ({ exam }) => {
  const { id, tasks } = exam;
  const [selectedTask, setSelectedTask] = useState<number>(0);

  const onUpdate = (payload: AnswerData | null) => {
    if (!payload) return Promise.reject();
    return DefaultExamService.createExamAnswers(id, payload);
  };

  const onClick = () => setSelectedTask((previous) => previous + 1);

  if (selectedTask === 0) {
    return (
      <WelcomeView>
        <ButtonList align="center">
          <Button onClick={() => setSelectedTask(1)} variant="PRIMARY">
            Start exam
          </Button>
        </ButtonList>
      </WelcomeView>
    );
  }

  if (selectedTask === tasks.length + 1) {
    return <ExitView />;
  }

  return (
    <Panel>
      <TaskView
        exam={exam}
        selected={selectedTask}
        onClick={onClick}
        onUpdate={onUpdate}
      />
    </Panel>
  );
};

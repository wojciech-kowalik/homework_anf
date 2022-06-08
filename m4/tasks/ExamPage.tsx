import { ExamView } from './ExamView';
import { useExam } from './data/useExam';
import { Loader } from 'ui/atoms';

export const ExamPage: React.FC = () => {
  const exam = useExam()
  return exam ? <ExamView exam={exam} /> : <Loader />;
}

/* eslint-disable jsx-a11y/accessible-emoji */
import { Typography } from "ui/atoms";
import { Center, EmojiWrapper } from "./styled";

interface Props {
  children?: React.ReactChild;
}

export const WelcomeView: React.FC<Props> = ({ children }) => {
  return (
    <Center>
      <Typography variant="h1">Welcome!</Typography>
      <EmojiWrapper role="img" aria-label="Books emoji">
        📚
      </EmojiWrapper>
      <Typography variant="body">
        Please click start to begin your exam.
      </Typography>
      {children}
    </Center>
  );
};

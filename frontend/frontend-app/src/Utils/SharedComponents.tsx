import styled from "styled-components";
import { COLORS } from "./Colors";
import { ReactComponent as MeetingAssistantIcon } from './icons/meeting-assistant-icon.svg';

// CONTAINER
export const Container = styled.div`
  margin: 10px;
  // padding: 20px;
  // border: 1px black solid; CAN UNCOMMENT THIS TO SEE THE BOUNDARY OF THE CONTAINER
`;

export const TextContainer = styled.div`
  padding: 10px;
  // border: 1px black solid; CAN UNCOMMENT THIS TO SEE THE BOUNDARY OF THE CONTAINER
`;

// TEXT
export const Title = styled.text`
  font-size: 24px;
  text-align: left;
  overflow: 'hidden';
  whiteSpace: 'nowrap';
  textOverflow: 'ellipsis';
  color: #636363};
  // border: 1px solid black; CAN UNCOMMENT THIS TO SEE THE BOUNDARY OF THE CONTAINER
`;

export const Subtitle = styled.text`
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  overflow: 'hidden';
  whiteSpace: 'nowrap';
  textOverflow: 'ellipsis';
  color: ${COLORS.black};
`;

export const Body = styled.text`
  font-size: 1em;
  text-align: left;
  overflow: 'hidden';
  whiteSpace: 'nowrap';
  textOverflow: 'ellipsis';
  color: ${COLORS.black};
`;

export function NUSHeader() {
  return (
    <Container>
      {/* <MeetingAssistantIcon style={{ height: '50px', width: '50px' }} /> Icon added here */}
      <Title>DSA4213 | gpt-10  </Title>
    </Container>
  );
}
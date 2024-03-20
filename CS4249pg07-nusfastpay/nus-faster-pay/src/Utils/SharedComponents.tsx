import styled from "styled-components";
import { COLORS } from "./Colors";

// CONTAINER
export const Container = styled.div`
  margin: 10px;
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
  color: ${COLORS.black};
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
      <Title>NUS Logo</Title>
    </Container>
  );
}

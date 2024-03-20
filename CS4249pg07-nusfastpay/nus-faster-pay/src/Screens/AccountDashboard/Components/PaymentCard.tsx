import styled from "styled-components";
import { PaymentItem, PaymentCardSize } from "../../../Utils/Types";
import { Body } from "../../../Utils/SharedComponents";
import { COLORS } from "../../../Utils/Colors";
import { RightArrow } from "./RightArrow";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled.div<{ size: PaymentCardSize }>`
  height: ${(props) =>
    props.size === "small"
      ? "20px"
      : props.size === "medium"
      ? "50px"
      : "120px"};
  padding: 10px;
  border-bottom: 1px solid ${COLORS.darkGray};
  background: ${COLORS.lightGray};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PriceArrowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface PaymentCardProps {
  item: PaymentItem;
  size: PaymentCardSize;
}

export function PaymentCard({ item, size }: PaymentCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const ivConfig = location.state;

  return (
    <Container
      size={size}
      onClick={() => navigate("/shopping-cart", { state: { item, ivConfig } })}
    >
      <Body>{item.title}</Body>
      <PriceArrowContainer>
        <Body>${item.price.toFixed(2)}</Body>
        <RightArrow />
      </PriceArrowContainer>
    </Container>
  );
}

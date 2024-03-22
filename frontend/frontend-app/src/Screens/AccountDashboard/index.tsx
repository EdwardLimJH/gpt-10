import React from "react";
import { useLocation } from "react-router-dom";
import { PaymentCard } from "./Components/PaymentCard";
import { paymentItems } from "../../Utils/Data";
import { Container, Title, TextContainer, Body } from "../../Utils/SharedComponents";
import { COLORS } from "../../Utils/Colors";

function AccountDashbaord() {
  const location = useLocation();
  const ivConfig = location.state;

  return (
    <Container>
      <TextContainer style={{ marginBottom: 10 }} >
        <Title>Account Dashboard</Title>
      </TextContainer>
      <TextContainer style={{ backgroundColor: COLORS.darkGray, padding: "10px" }}>
          <Body style={{ marginBottom: 10, textAlign: 'center' }}>Student Account Balances</Body>
      </TextContainer>
      {paymentItems.map((item, index) => {
      return <PaymentCard item={item} size={ivConfig.paymentCardSize} />;
      })}
    </Container>
  );
}

export default AccountDashbaord;

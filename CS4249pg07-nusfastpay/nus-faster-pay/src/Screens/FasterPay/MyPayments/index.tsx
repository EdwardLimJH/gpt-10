import React from 'react';
import { useNavigate } from "react-router-dom";

function MyPayments() {
  const navigate = useNavigate();

  return (
    <div>
        <p>
            My Payments Screen
        </p>
        <button onClick={() => navigate("/payment-options")}>Next</button>
    </div>
  );
}

export default MyPayments;
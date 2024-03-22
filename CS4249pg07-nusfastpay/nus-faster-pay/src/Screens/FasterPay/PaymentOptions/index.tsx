import React from 'react';
import { useNavigate } from "react-router-dom";

function PaymentOptions() {
  const navigate = useNavigate();

  return (
    <div>
        <p>
            Payment Options Screen
        </p>
        <button onClick={() => navigate("/qr-code")}>Next</button>
    </div>
  );
}

export default PaymentOptions;
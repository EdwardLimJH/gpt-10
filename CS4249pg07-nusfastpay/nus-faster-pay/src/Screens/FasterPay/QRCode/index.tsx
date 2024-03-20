import React from 'react';
import { useNavigate } from "react-router-dom";

function QRCode() {
  const navigate = useNavigate();

  return (
    <div>
        <p>
            QR Code Screen
        </p>
    </div>
  );
}

export default QRCode;
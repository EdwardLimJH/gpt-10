import React from "react";
import { Route, Routes } from "react-router-dom";
import StartScreen from "./Screens/StartScreen";
import "./App.css";
import MyPayments from "./Screens/FasterPay/MyPayments";
import PaymentOptions from "./Screens/FasterPay/PaymentOptions";
import QRCode from "./Screens/FasterPay/QRCode";

function App() {  
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/my-payments" element={<MyPayments />} />
      <Route path="/payment-options" element={<PaymentOptions />} />
      <Route path="/qr-code" element={<QRCode />} />
    </Routes>
  );
}

export default App;

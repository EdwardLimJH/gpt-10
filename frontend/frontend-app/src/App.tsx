import React from "react";
import { Route, Routes } from "react-router-dom";
import StartScreen from "./Screens/StartScreen";
import "./App.css";
import PaymentOptions from "./Screens/PaymentOptions";
import QRCode from "./Screens/QRCode";
import AccountDashbaord from "./Screens/AccountDashboard";
import Review from "./Screens/Review";
import Preview from "./Screens/Preview";
import ShoppingCart from "./Screens/ShoppingCart";
import CustomerDetails from "./Screens/CustomerDetails";
import { NUSHeader } from "./Utils/SharedComponents";

function App() {  
  return (
    <div style={{padding: "20px 100px 20px 100px"}}>
      <NUSHeader></NUSHeader>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/review" element={<Review />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/account-dashboard" element={<AccountDashbaord />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/payment-options" element={<PaymentOptions />} />
        <Route path="/customer-details" element={<CustomerDetails />} />
        <Route path="/qr-code" element={<QRCode />} />
      </Routes>
    </div>
  );
}

export default App;

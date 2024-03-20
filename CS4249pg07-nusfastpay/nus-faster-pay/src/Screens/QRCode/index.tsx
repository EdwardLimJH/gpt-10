import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import payLahImage from './images/pay_lah.jpg'; // Import the image correctly

function QRCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const ivConfig = location.state || {}; // Ensure a fallback for ivConfig to an empty object
  const { email } = ivConfig; // Destructure to get the email address passed from the previous component

  // Handlers for button actions
  const handleBack = () => {
    navigate(-1); // Goes back one page in history
  };

  const handleSelectDifferent = () => {
    navigate(-2); // Goes back two pages in history
  };

  // "Cancel Payment" button's handler
  const handleCancelPayment = () => {
    // Placeholder function for future implementation
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <h2>PayNow</h2>
        <div style={{ marginBottom: '20px' }}>
          <div><strong>Number</strong> ABCDEF12345</div>
          <div><strong>Amount</strong> $7,287.20</div>
          <div><strong>Email</strong> {email || 'No email provided'}</div> {/* Display the passed email or a placeholder */}
        </div>
        <p style={{ maxWidth: '500px', textAlign: 'center', marginBottom: '20px' }}>
          Note: Please DO NOT use your BACK or RELOAD/REFRESH browser functions or CLOSE your browser while making payment.
        </p>
        <p>Please scan the QR code with your mobile banking app to complete the payment. This page will be updated when payment is complete.</p>
        <div style={{ position: 'relative', maxWidth: '90%', height: 'auto' }}>
            <img
              src={payLahImage}
              alt="PayLah QR Code"
              style={{ width: '100%', height: 'auto' }}
            />
            <button 
              onClick={handleBack} 
              style={{ 
                position: 'absolute',
                left: 0,
                bottom:
                '-30px', // Adjusted to move the button up slightly
                transform: 'translateY(100%)',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: 'white',
                zIndex: 2 // Ensure the button is above any other elements
                }}>
                Back
                </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '20px' }}>
            <button 
                       onClick={handleSelectDifferent}
                       style={buttonStyle}>
            Select a different payment method
            </button>
            <button 
                       onClick={handleCancelPayment}
                       style={buttonStyle}>
            Cancel payment
            </button>
        </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: 'white',
  width: '300px' // Or any width that fits your design
};

export default QRCode;

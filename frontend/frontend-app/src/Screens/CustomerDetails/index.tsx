import React, { useState, FormEvent } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

function CustomerDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const ivConfig = location.state;
  const [email, setEmail] = useState(''); // State to hold the email input

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/qr-code", { state: { ...ivConfig, email } });
  };

  // Handler for the Back button
  const handleBack = () => {
    navigate(-1); // This will take the user back to the previous page in the history stack
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h1>Customer Details</h1>
        <p style={{ textAlign: 'center', maxWidth: '500px', marginBottom: '20px' }}>
          If you wish to have a receipt emailed to you following payment, provide your email address here.
        </p>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '10px' }}>Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick={handleBack} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
              Back
            </button>
            <button type="submit" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
              Next
            </button>
          </div>
        </form>
    </div>
  );
}

export default CustomerDetails;

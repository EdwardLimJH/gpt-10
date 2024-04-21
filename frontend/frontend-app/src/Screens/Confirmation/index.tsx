import React from 'react';
import { Link } from 'react-router-dom';

// React functional component for the confirmation page
const Confirmation = () => {
  // Render method that returns JSX for the confirmation page
  return (
    <div>
      <h2>Confirmation Page</h2>
      <p>Your email has been sent successfully!</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

export default Confirmation;

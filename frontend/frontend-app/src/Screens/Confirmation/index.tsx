import React from 'react';
import { Link } from 'react-router-dom';

const Confirmation = () => {
  return (
    <div>
      <h2>Confirmation Page</h2>
      <p>Your email has been sent successfully!</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

export default Confirmation;

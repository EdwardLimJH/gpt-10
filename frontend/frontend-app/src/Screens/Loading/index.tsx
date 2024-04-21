import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled component for the loading page
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const LoadingText = styled.p`
  font-size: 24px;
  color: #333;
`;

// React functional component for the loading page
function LoadingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state) {
      navigate('/');
      return;
    }
  }, [navigate, state]);

  // Render method to display the loading text
  return (
    <LoadingContainer>
      <LoadingText>Loading...</LoadingText>
      {/* Optionally, display a spinner or any loading indicator here */}
    </LoadingContainer>
  );
}

export default LoadingPage;

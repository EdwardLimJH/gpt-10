import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

function LoadingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state) {
      navigate('/');
      return;
    }

    // // Simulate a loading process
    // const timer = setTimeout(() => {
    //   navigate('/review', { state });
    // }, 2000); // Adjust the time as necessary

    // return () => clearTimeout(timer);
  }, [navigate, state]);

  return (
    <LoadingContainer>
      <LoadingText>Loading...</LoadingText>
      {/* Optionally, display a spinner or any loading indicator here */}
    </LoadingContainer>
  );
}

export default LoadingPage;

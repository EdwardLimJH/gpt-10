import React from 'react';
import styled from 'styled-components';

// Styled Components
const PageContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const PreviewContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
`;

const PreviewHeading = styled.h1`
  margin-bottom: 20px;
`;

const EmailPreview = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 4px;
`;

function Preview() {
  // Mock email content for preview
  const emailContent = `
    <h2>Meeting Information</h2>
    <p>Date and Time: 19/3/2024 10:00-12:00</p>
    <p>Venue: Com 3</p>
    <p>Duration: 37 mins</p>
    <p>Requested by: Lim Jun Heng, Edward</p>
    
    <h2>Selected Email Addresses</h2>
    <ul>
      <li>example1@example.com</li>
      <li>example2@example.com</li>
      <li>example3@example.com</li>
    </ul>
    
    <h2>Attendees</h2>
    <ul>
      <li>Edward</li>
      <li>Cheng Hong</li>
      <li>Hannah</li>
      <li>Peng Hao</li>
      <li>Micole</li>
    </ul>
    
    <h2>Selected Language</h2>
    <p>English</p>
    
    <h2>Meeting Purpose</h2>
    <h3>Objective</h3>
    <ul>
      <li>To discuss the development of a chatbot for a software company</li>
      <li>Discuss budget</li>
      <li>Review project timeline</li>
    </ul>
    <h3>Desired outcome</h3>
    <p>To outline the key features and functionalities of the chatbot, and to assign tasks to team members for its development</p>
    
    <h2>Action Items</h2>
    <h3>Deliverables</h3>
    <ul>
      <li>Develop a chatbot for a software company</li>
      <li>Include the following features:</li>
      <li>Summarize meetings</li>
      <li>Generate meeting minutes</li>
      <li>Provide translations</li>
    </ul>
    <h3>Assignments</h3>
    <ul>
      <li>Ryan_Edward: Lead the development of the chatbot</li>
      <li>Eugene_YJ: Work on the summarization feature</li>
      <li>Hannah Nga: Work on the generation of meeting minutes</li>
      <li>Ben_CH: Work on the translation feature</li>
      <li>Jeremy_PH: Assist with the development of the chatbot</li>
      <li>Chan Yi Ru Micole: Assist with the development of the chatbot and provide input on the meeting summary feature.</li>
    </ul>
  `;

  return (
    <PageContainer>
      <PreviewContainer>
        <PreviewHeading>Email Preview</PreviewHeading>
        <EmailPreview dangerouslySetInnerHTML={{ __html: emailContent }} /> {/* Render HTML content */}
      </PreviewContainer>
    </PageContainer>
  );
}

export default Preview;

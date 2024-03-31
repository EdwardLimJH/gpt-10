import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Define a TypeScript interface for the page props
interface PreviewProps {
  meetingInformation: {
    dateAndTime: string;
    duration: string;
    venue: string;
    requestedBy: string;
  };
  emailAddresses: string;
  attendees: string[];
  language: string;
  agenda: string[];
  desiredOutcome: string;
  deliverables: string[];
  assignments: string[];
}

// Styled Components for the email preview
const EmailPreviewContainer = styled.div`
  background-color: #f4f4f4;
  padding: 20px;
  max-width: 600px;
  margin: auto;
  font-family: Arial, sans-serif;
`;

const Header = styled.h2`
  color: #333;
`;

const Content = styled.div`
  background-color: #fff;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
`;

const ListItem = styled.li`
  margin-bottom: 5px;
`;

function Preview() {
    const location = useLocation();
    // Use optional chaining and nullish coalescing to provide default values
    const state = location.state ?? {};
    const {
        meetingInformation = {
        dateAndTime: 'N/A',
        duration: 'N/A',
        venue: 'N/A',
        requestedBy: 'N/A',
        },
        emailAddresses = 'N/A',
        attendees = [],
        language = 'N/A',
        agenda = [],
        desiredOutcome = 'N/A',
        deliverables = [],
        assignments = [],
    } = state as PreviewProps;
    // const storedState = localStorage.getItem('previewState');
    // const state: PreviewProps = storedState ? JSON.parse(storedState) : {};



  return (
    <EmailPreviewContainer>
      <Header>Email Preview</Header>
      <Content>
        <p><strong>Meeting Information</strong></p>
        <p>Date and Time: {meetingInformation.dateAndTime}</p>
        <p>Venue: {meetingInformation.venue}</p>
        <p>Duration: {meetingInformation.duration}</p>
        <p>Requested by: {meetingInformation.requestedBy}</p>
      </Content>
      <Content>
        <p><strong>Selected Email Addresses</strong></p>
        <p>{emailAddresses}</p>
      </Content>
      <Content>
        <p><strong>Attendees</strong></p>
        <ul>
          {attendees.map((attendee, index) => (
            <ListItem key={index}>{attendee}</ListItem>
          ))}
        </ul>
      </Content>
      <Content>
        <p><strong>Selected Language</strong></p>
        <p>{language}</p>
      </Content>
      <Content>
        <p><strong>Meeting Purpose</strong></p>
        <p>Objective:</p>
        <ul>
          {agenda.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </ul>
        <p>Desired outcome: {desiredOutcome}</p>
      </Content>
      <Content>
        <p><strong>Action Items</strong></p>
        <p>Deliverables:</p>
        <ul>
          {deliverables.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </ul>
        <p>Assignments:</p>
        <ul>
          {assignments.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </ul>
      </Content>
    </EmailPreviewContainer>
  );
}

export default Preview;

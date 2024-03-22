import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

// Define a TypeScript interface for the component props
interface ReviewProps {
  language?: string;
  emailAddresses?: string;
}

// Styled Components
const PageContainer = styled.div`
  background-color: #fff;
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
`;

const InformationContainer = styled.div`
  background-color: #ff0;
  padding: 10px;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 5px 0;
`;

function Review() {
  const location = useLocation();
  const locationState = location.state as ReviewProps; // Cast the location state to the ReviewProps type

  // Use the location state directly
  const language = locationState.language ?? ''; // Using nullish coalescing operator ??
  const emailAddresses = locationState.emailAddresses ?? '';

  // Static data for demonstration
  const agenda = ['Discuss budget', 'Review project timeline'];
  const meetingInformation = {
    dateAndTime: '19/3/2024 10:00-12:00',
    venue: 'Com 3',
    requestedBy: 'Lim Jun Heng, Edward'
  };
  const attendees = ['Edward', 'Cheng Hong', 'Hannah', 'Peng Hao', 'Micole'];

  return (
    <PageContainer>
      <Section>
        <SectionTitle>Meeting Information (Note: Static Data for now)</SectionTitle>
        <InformationContainer>
          <p>Date and Time: {meetingInformation.dateAndTime}</p>
          <p>Venue: {meetingInformation.venue}</p>
          <p>Requested by: {meetingInformation.requestedBy}</p>
        </InformationContainer>
      </Section>
      <Section>
        <SectionTitle>Agenda</SectionTitle>
        <List>
          {agenda.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
      </Section>
      <Section>
        <SectionTitle>Attendees</SectionTitle>
        <List>
          {attendees.map((attendee, index) => (
            <ListItem key={index}>{attendee}</ListItem>
          ))}
        </List>
      </Section>
      <Section>
        <SectionTitle>Selected Language</SectionTitle>
        <p>{language}</p>
      </Section>
      <Section>
        <SectionTitle>Selected Email Addresses</SectionTitle>
        <List>
          {emailAddresses.split(', ').map((email, index) => (
            <ListItem key={index}>{email}</ListItem>
          ))}
        </List>
      </Section>
    </PageContainer>
  );
}

export default Review;

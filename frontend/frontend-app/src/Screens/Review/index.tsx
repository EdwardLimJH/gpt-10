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
  const agenda = ['To discuss the development of a chatbot for a software company', 'Discuss budget', 'Review project timeline'];
  const Deliverables = ['Develop a chatbot for a software company', 'Include the following features:', 'Summarize meetings',  'Generate meeting minutes', 'Provide translations'];
  const Assign = ['Ryan_Edward: Lead the development of the chatbot', 'Eugene_YJ: Work on the summarization feature', 'Hannah Nga: Work on the generation of meeting minutes',  'Ben_CH: Work on the translation feature', 
  'Jeremy_PH: Assist with the development of the chatbot', 'Chan Yi Ru Micole: Assist with the development of the chatbot and provide input on the meeting summary feature.'];

  const meetingInformation = {
    dateAndTime: '19/3/2024 10:00-12:00',
    duration: '37 mins',
    venue: 'Com 3',
    requestedBy: 'Lim Jun Heng, Edward',
    Desired_outcome: 'To outline the key features and functionalities of the chatbot, and to assign tasks to team members for its development',
    Meeting_Summary: 'The meeting discussed the development of a chatbot for a software company. The team discussed the key features and functionalities of the chatbot, including the ability to summarize meetings, generate meeting minutes, and provide translations. The team also discussed the distribution of workload and assigned tasks to team members for the development of the chatbot.'
  };
  const attendees = ['Edward', 'Cheng Hong', 'Hannah', 'Peng Hao', 'Micole'];

  return (
    <PageContainer>
      <Section>
        <h1>Meeting Information (Note: Static Data for now)</h1>
        <InformationContainer>
          <p>Date and Time: {meetingInformation.dateAndTime}</p>
          <p>Venue: {meetingInformation.venue}</p>
          <p>Duration: {meetingInformation.duration}</p>
          <p>Requested by: {meetingInformation.requestedBy}</p>
        </InformationContainer>
      </Section>
      <Section>
        <h1>Attendees</h1>
        <List>
          {attendees.map((attendee, index) => (
            <ListItem key={index}>{attendee}</ListItem>
          ))}
        </List>
      </Section>
      <Section>
        <h1>Selected Language</h1>
        <p>{language}</p>
      </Section>
      <Section>
        <h1>Selected Email Addresses</h1>
        <List>
          {emailAddresses.split(', ').map((email, index) => (
            <ListItem key={index}>{email}</ListItem>
          ))}
        </List>
      </Section>
      <Section>
        <h1>Meeting Purpose</h1>
        <h2> Objective </h2>
        <List>
          {agenda.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
        <h2> Desired outcome </h2>
        <p>{meetingInformation.Desired_outcome}</p>
      </Section>
      <Section>
      <h1>Meeting Summary</h1>
      <p>{meetingInformation.Meeting_Summary}</p>
      </Section>
      <Section>
      <h1>Action Items</h1>
      <h2> Deliverables </h2>
      <p><List>
          {Deliverables.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List></p>
      <h2> Assign </h2>
      <p><List>
          {Assign.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List></p>
      </Section>
    </PageContainer>
  );
}

export default Review;

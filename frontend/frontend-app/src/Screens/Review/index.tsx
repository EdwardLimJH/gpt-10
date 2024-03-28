import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, Link } from 'react-router-dom';

// Define a TypeScript interface for the component props
interface ReviewProps {
  language?: string;
  emailAddresses?: string;
}

// Styled Components
const PageContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
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

const EditInput = styled.input`
  display: block;
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const SaveButton = styled.button`
  background-color: #008CBA; /* Blue */
  color: white;
  padding: 10px 15px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #007B9A;
  }
`;

const CancelButton = styled(SaveButton)`
  background-color: #f44336; /* Red */

  &:hover {
    background-color: #d32f2f;
  }
`;

const EmailPreview = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
`;

const PreviewButton = styled.button`
  background-color: #4CAF50; /* Green */
  color: white;
  padding: 10px 15px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;

function Review() {
  const location = useLocation();
  const locationState = location.state as ReviewProps;

  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [emailAddresses, setEmailAddresses] = useState(locationState.emailAddresses ?? '');

  const [meetingInformation, setMeetingInformation] = useState({
    dateAndTime: '19/3/2024 10:00-12:00',
    duration: '37 mins',
    venue: 'Com 3',
    requestedBy: 'Lim Jun Heng, Edward',
  });
  const [attendees, setAttendees] = useState(['Edward', 'Cheng Hong', 'Hannah', 'Peng Hao', 'Micole']);
  const [language, setLanguage] = useState(locationState.language ?? '');
  const [agenda, setAgenda] = useState([
    'To discuss the development of a chatbot for a software company',
    'Discuss budget',
    'Review project timeline'
  ]);
  const [desiredOutcome, setDesiredOutcome] = useState('To outline the key features and functionalities of the chatbot, and to assign tasks to team members for its development');
  const [deliverables, setDeliverables] = useState([
    'Develop a chatbot for a software company',
    'Include the following features:',
    'Summarize meetings',
    'Generate meeting minutes',
    'Provide translations'
  ]);
  const [assignments, setAssignments] = useState([
    'Ryan_Edward: Lead the development of the chatbot',
    'Eugene_YJ: Work on the summarization feature',
    'Hannah Nga: Work on the generation of meeting minutes',
    'Ben_CH: Work on the translation feature',
    'Jeremy_PH: Assist with the development of the chatbot',
    'Chan Yi Ru Micole: Assist with the development of the chatbot and provide input on the meeting summary feature.'
  ]);

  // Function to handle edit mode toggle
  const toggleEdit = (section: string) => {
    setEditMode(prevState => ({ ...prevState, [section]: !prevState[section] }));
  };

  // Handlers for changes in the editable fields
  const handleMeetingInfoChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setMeetingInformation(prevState => ({ ...prevState, [field]: e.target.value }));
  };

  const handleAttendeesChange = (index: number, value: string) => {
    setAttendees(prevAttendees => prevAttendees.map((attendee, i) => i === index ? value : attendee));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(e.target.value);
  };

  const handleAgendaChange = (index: number, value: string) => {
    setAgenda(prevAgenda => prevAgenda.map((item, i) => i === index ? value :item));
  };
  
  const handleDesiredOutcomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setDesiredOutcome(e.target.value);
  };
  
  const handleDeliverablesChange = (index: number, value: string) => {
  setDeliverables(prevDeliverables => prevDeliverables.map((item, i) => i === index ? value : item));
  };
  
  const handleAssignmentsChange = (index: number, value: string) => {
  setAssignments(prevAssignments => prevAssignments.map((item, i) => i === index ? value : item));
  };

  const handleEmailAddressesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddresses(e.target.value);
  };

  // Rendering editable email addresses field
  const renderEditableEmailAddresses = () => (
    <EditInput
      type="text"
      value={emailAddresses}
      onChange={handleEmailAddressesChange}
    />
  );
  
  // Rendering editable fields
  const renderEditableField = (value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, key: string) => (
    <EditInput
      key={key}
      type="text"
      value={value}
      onChange={onChange}
    />
  );
  
  
  return (
    <PageContainer>
      <Section>
        <h1>Review Page</h1>
      </Section>
      {/* Meeting Information Section */}
      <Section>
        <h1>Meeting Information</h1>
        {editMode.meetingInfo ? (
          <InformationContainer>
            {renderEditableField(meetingInformation.dateAndTime, (e) => handleMeetingInfoChange(e, 'dateAndTime'), 'dateAndTime')}
            {renderEditableField(meetingInformation.venue, (e) => handleMeetingInfoChange(e, 'venue'), 'venue')}
            {renderEditableField(meetingInformation.duration, (e) => handleMeetingInfoChange(e, 'duration'), 'duration')}
            {renderEditableField(meetingInformation.requestedBy, (e) => handleMeetingInfoChange(e, 'requestedBy'), 'requestedBy')}
            <SaveButton onClick={() => toggleEdit('meetingInfo')}>Save</SaveButton>
            <CancelButton onClick={() => toggleEdit('meetingInfo')}>Cancel</CancelButton>
          </InformationContainer>
        ) : (
          <InformationContainer>
            <p>Date and Time: {meetingInformation.dateAndTime}</p>
            <p>Venue: {meetingInformation.venue}</p>
            <p>Duration: {meetingInformation.duration}</p>
            <p>Requested by: {meetingInformation.requestedBy}</p>
            <SaveButton onClick={() => toggleEdit('meetingInfo')}>Edit</SaveButton>
          </InformationContainer>
        )}
      </Section>
      {/* Selected Email Addresses Section */}
      <Section>
        <h1>Selected Email Addresses</h1>
        {editMode.emailAddresses ? (
          <>
            {renderEditableEmailAddresses()}
            <SaveButton onClick={() => toggleEdit('emailAddresses')}>Save</SaveButton>
            <CancelButton onClick={() => toggleEdit('emailAddresses')}>Cancel</CancelButton>
          </>
        ) : (
          <>
            <List>
              {emailAddresses.split(', ').map((email, index) => (
                <ListItem key={index}>{email}</ListItem>
              ))}
            </List>
            <SaveButton onClick={() => toggleEdit('emailAddresses')}>Edit</SaveButton>
          </>
        )}
      </Section>
      {/* Attendees Section */}
      <Section>
        <h1>Attendees</h1>
        {editMode.attendees ? (
          <>
            {attendees.map((attendee, index) => (
              renderEditableField(attendee, (e) => handleAttendeesChange(index, e.target.value), `attendee-${index}`)
            ))}
            <SaveButton onClick={() => toggleEdit('attendees')}>Save</SaveButton>
            <CancelButton onClick={() => toggleEdit('attendees')}>Cancel</CancelButton>
          </>
        ) : (
          <>
            <List>
              {attendees.map((attendee, index) => (
                <ListItem key={index}>{attendee}</ListItem>
              ))}
            </List>
            <SaveButton onClick={() => toggleEdit('attendees')}>Edit</SaveButton>
          </>
        )}
      </Section>
  
      {/* Selected Language Section */}
      <Section>
        <h1>Selected Language</h1>
        {editMode.language ? (
          <>
            {renderEditableField(language, handleLanguageChange, 'language')}
            <SaveButton onClick={() => toggleEdit('language')}>Save</SaveButton>
            <CancelButton onClick={() => toggleEdit('language')}>Cancel</CancelButton>
          </>
        ) : (
          <>
            <p>{language}</p>
            <SaveButton onClick={() => toggleEdit('language')}>Edit</SaveButton>
          </>
        )}
      </Section>
  
      {/* Meeting Purpose Section (Objective & Desired Outcome) */}
      <Section>
        <h1>Meeting Purpose</h1>
        {editMode.meetingPurpose ? (
          <>
            {agenda.map((item, index) => (
              renderEditableField(item, (e) => handleAgendaChange(index, e.target.value), `agenda-${index}`)
            ))}
            {renderEditableField(desiredOutcome, handleDesiredOutcomeChange, 'desiredOutcome')}
            <SaveButton onClick={() => toggleEdit('meetingPurpose')}>Save</SaveButton>
            <CancelButton onClick={() => toggleEdit('meetingPurpose')}>Cancel</CancelButton>
          </>
        ) : (
          <>
            <h2>Objective</h2>
            <List>
              {agenda.map((item, index) => (
                <ListItem key={index}>{item}</ListItem>
              ))}
            </List>
            <h2>Desired outcome</h2>
            <p>{desiredOutcome}</p>
            <SaveButton onClick={() => toggleEdit('meetingPurpose')}>Edit</SaveButton>
          </>
        )}
      </Section>
  
      {/* Action Items Section (Deliverables & Assignments) */}
      <Section>
        <h1>Action Items</h1>
        {editMode.actionItems ? (
          <>
            <h2>Deliverables</h2>
            {deliverables.map((item, index) => (
              renderEditableField(item, (e) => handleDeliverablesChange(index, e.target.value), `deliverable-${index}`)
            ))}
            <h2>Assignments</h2>
            {assignments.map((item, index) => (
              renderEditableField(item, (e) => handleAssignmentsChange(index, e.target.value), `assignment-${index}`)
              ))}
            <SaveButton onClick={() => toggleEdit('actionItems')}>Save</SaveButton>
            <CancelButton onClick={() => toggleEdit('actionItems')}>Cancel</CancelButton>
          </>
        ) : (
          <>
            <h2>Deliverables</h2>
            <List>
              {deliverables.map((item, index) => (
                <ListItem key={`deliverable-view-${index}`}>{item}</ListItem>
              ))}
            </List>
            <h2>Assignments</h2>
            <List>
              {assignments.map((item, index) => (
                <ListItem key={`assignment-view-${index}`}>{item}</ListItem>
              ))}
            </List>
            <SaveButton onClick={() => toggleEdit('actionItems')}>Edit</SaveButton>
          </>
        )}
      </Section>
      {/* Preview Button */}
      <Section>
        <Link to="/preview"> {/* Link to the Preview page */}
          <PreviewButton>Preview</PreviewButton>
        </Link>
      </Section>
      <Section>
        <h1>Email Preview</h1>
        <EmailPreview>
          <h2>Meeting Information</h2>
          <InformationContainer>
            <p>Date and Time: {meetingInformation.dateAndTime}</p>
            <p>Venue: {meetingInformation.venue}</p>
            <p>Duration: {meetingInformation.duration}</p>
            <p>Requested by: {meetingInformation.requestedBy}</p>
          </InformationContainer>
          <h2>Selected Email Addresses</h2>
          <List>
            {emailAddresses.split(', ').map((email, index) => (
              <ListItem key={index}>{email}</ListItem>
            ))}
          </List>
          <h2>Attendees</h2>
          <List>
            {attendees.map((attendee, index) => (
              <ListItem key={index}>{attendee}</ListItem>
            ))}
          </List>
          <h2>Selected Language</h2>
          <p>{language}</p>
          <h2>Meeting Purpose</h2>
          <List>
            {agenda.map((item, index) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </List>
          <p><strong>Desired Outcome:</strong> {desiredOutcome}</p>
          <h2>Action Items</h2>
          <h3>Deliverables</h3>
          <List>
            {deliverables.map((item, index) => (
              <ListItem key={`deliverable-${index}`}>{item}</ListItem>
            ))}
          </List>
          <h3>Assignments</h3>
          <List>
            {assignments.map((item, index) => (
              <ListItem key={`assignment-${index}`}>{item}</ListItem>
            ))}
          </List>
        </EmailPreview>
      </Section>

    </PageContainer>
  );
}

export default Review;

            

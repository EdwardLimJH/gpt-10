import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';


// Define a TypeScript interface for the component props
interface Actionable {
  Action: string;
  Deadline: string;
  Assigned: string;
  Priority: string;
}

interface ReviewProps {
  language?: string;
  email_list?: string;
  attachment?: File;
  // result?: string;
  agenda?: string;
  meetingSummary?: string;
  actionables?: Actionable[]; // Ensure this matches the JSON structure
}

// Styled Components
const PageContainer = styled.div`
  display: flex;
  background-color: #f0f0f0;
  padding: 20px;
  max-width: 1500px;
  margin: auto;
`;

const Section = styled.div`
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Column = styled.div`
  flex: 1;
`;


const InformationContainer = styled.div`
  background-color: #FFFFED;
  padding: 10px;
  &:hover {
    background-color: #fffacd;
  }
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
  background-color: #8AC7DB;
  color: white;
  padding: 10px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #43A6C6;
  }
`;

const CancelButton = styled(SaveButton)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;


const EmailPreview = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PreviewHeader = styled.div`
  background-color: #43A6C6;
  color: #fff;
  padding: 15px;
  border-radius: 8px 8px 0 0;
  margin-bottom: 20px;
`;

const PreviewSection = styled.div`
  margin-bottom: 20px;
`;

const PreviewLabel = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const PreviewList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PreviewItem = styled.li`
  padding: 5px 0;
  color: #555;
`;

const CustomBullet = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #A9A9A9;
  margin-right: 8px;
`;

const ConfirmButton = styled.button`
  background-color: #43A6C6;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #357d99;
  }
`;

const RegenerateButton = styled.button`
  background-color: #f0ad4e;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;

  &:hover {
    background-color: #ec971f;
  }
`;

const LanguageButton = styled(ConfirmButton)`
  background-color: #5bc0de;
  margin-right: 5px;

  &:hover {
    background-color: #31b0d5;
  }
`;



function Review() {

  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as ReviewProps;

  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [email_list, setEmailAddresses] = useState(locationState.email_list ?? '');
  const [attachment, setAttachment] = useState<File | null>(locationState.attachment ?? null);


  const [meetingInformation, setMeetingInformation] = useState({
    dateAndTime: '19/3/2024 10:00-12:00',
    duration: '37 mins',
    venue: 'Com 3',
    requestedBy: 'Lim Jun Heng, Edward',
  });
  const [attendees, setAttendees] = useState(['Edward', 'Cheng Hong', 'Hannah', 'Peng Hao', 'Micole']);
  const [language, setLanguage] = useState(locationState.language ?? '');

  const [agenda, setAgenda] = useState(locationState.agenda ? locationState.agenda.split(", ") : []);
  // const [agenda, setAgenda] = useState([
  //   'To discuss the development of a chatbot for a software company',
  //   'Discuss budget',
  //   'Review project timeline'
  // ]);

  const [meetingSummary, setDesiredOutcome] = useState(locationState.meetingSummary ?? '');
  // const [desiredOutcome, setDesiredOutcome] = useState('To outline the key features and functionalities of the chatbot, and to assign tasks to team members for its development');
  const [deliverables, setDeliverables] = useState([
    'Develop a chatbot for a software company',
    'Include the following features:',
    'Summarize meetings',
    'Generate meeting minutes',
    'Provide translations'
  ]);

  const [assignments, setAssignments] = useState<string[]>(() => {
    // If actionables is defined, map over it to create an array of strings
    return locationState.actionables
      ? locationState.actionables.map(a => `${a.Assigned}: ${a.Action}`)
      : []; // Default to an empty array if actionables is undefined
  });
  // const [assignments, setAssignments] = useState([
  //   'Ryan_Edward: Lead the development of the chatbot',
  //   'Eugene_YJ: Work on the summarization feature',
  //   'Hannah Nga: Work on the generation of meeting minutes',
  //   'Ben_CH: Work on the translation feature',
  //   'Jeremy_PH: Assist with the development of the chatbot',
  //   'Chan Yi Ru Micole: Assist with the development of the chatbot and provide input on the meeting summary feature.'
  // ]);


  const handleSubmit = () => {
    if (!attachment || !email_list) {
      alert("Please provide an attachment and at least one email address.");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', attachment); // Append the file
    formData.append('language', language); // Append the selected language
    formData.append('email_list', email_list); // Append the email addresses
  
    // Navigate to the loading page immediately
    navigate('/loading', { state: { attachment, language, email_list } });
  
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/get_LLM_response', true);
  
    xhr.onload = () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        console.log(result.message);
        // Parse the JSON string into a JavaScript object
        const meetingData = JSON.parse(result);
  
        // Now you can extract any part of the parsed object
        const agenda = meetingData.Agenda;
        const meetingSummary = meetingData['Meeting Summary'];
        const actionables = meetingData.Actionables;
        // Navigate to the review page when the request is successful
        navigate('/review', { state: { agenda, meetingSummary, actionables, attachment, language, email_list } });
      } else {
        console.error('Error caught:', xhr.statusText);
      }
    };
  
    xhr.onerror = () => {
      console.error('An error occurred during the transaction');
    };
  
    xhr.send(formData);
  };

  // Function to handle edit mode toggle
  const toggleEdit = (section: string) => {
    setEditMode(prevState => ({ ...prevState, [section]: !prevState[section] }));
  };

  const [editedSections, setEditedSections] = useState<{ [key: string]: boolean }>({});

  // Handlers for changes in the editable fields
  const handleMeetingInfoChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setMeetingInformation(prevState => ({ ...prevState, [field]: e.target.value }));
  };

  const handleAttendeesChange = (index: number, value: string) => {
    setAttendees(prevAttendees => prevAttendees.map((attendee, i) => i === index ? value : attendee));
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
    setAssignments((prevAssignments) => prevAssignments.map((item, i) => i === index ? value : item));
  };

  const handleEmailAddressesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddresses(e.target.value);
  };

  const handleChangeLanguage = () => {
    // Example: Prompt the user to enter a new language
    const newLanguage = prompt('Enter new language (e.g., English, Spanish):');
    if (newLanguage) {
      setLanguage(newLanguage); // Update the language state
    }
  };

  const handleSave = (section: string) => {
    toggleEdit(section); // Toggle edit mode
    setEditedSections(prevState => ({
      ...prevState,
      [section]: true // Mark the section as edited
    }));
  
    // Set a timeout to reset the highlight state for this section after 10 seconds
    setTimeout(() => {
      setEditedSections(prevState => ({
        ...prevState,
        [section]: false // Reset the edited state for the section
      }));
    }, 10000); // 10000 milliseconds = 10 seconds
  };

  const renderEditableEmailAddresses = () => (
    <EditInput
      type="text"
      value={email_list}
      onChange={handleEmailAddressesChange}
    />
  );
  
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
      <Column style={{ flex: 5 }}>
        <Section>
          <h1>Review Page</h1>
          
          {/* Selected Email Addresses Section */}
          <Section>
            <h2>Selected Email Addresses</h2>
            <InformationContainer>
            {editMode.email_list ? (
              <>
                {renderEditableEmailAddresses()}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SaveButton onClick={() => handleSave('email_list')}>Save</SaveButton>
                  <CancelButton onClick={() => toggleEdit('email_list')}>Cancel</CancelButton>
                </div>
              </>
            ) : (
              <>
                <List>
                  {email_list.split(', ').map((email, index) => (
                    <ListItem key={index}>{email}</ListItem>
                  ))}
                </List>
                <div style={{ textAlign: 'right' }}>
                  <SaveButton onClick={() => handleSave('email_list')}>Edit</SaveButton>
                </div>
              </>
            )}
            </InformationContainer>
          </Section>
          
          {/* Meeting Information Section */}
          <Section>
            <h2>Meeting Information</h2>
            {editMode.meetingInfo ? (
              <InformationContainer>
                {renderEditableField(meetingInformation.dateAndTime, (e) => handleMeetingInfoChange(e, 'dateAndTime'), 'dateAndTime')}
                {renderEditableField(meetingInformation.venue, (e) => handleMeetingInfoChange(e, 'venue'), 'venue')}
                {renderEditableField(meetingInformation.duration, (e) => handleMeetingInfoChange(e, 'duration'), 'duration')}
                {renderEditableField(meetingInformation.requestedBy, (e) => handleMeetingInfoChange(e, 'requestedBy'), 'requestedBy')}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SaveButton onClick={() => handleSave('meetingInfo')}>Save</SaveButton>
                  <CancelButton onClick={() => toggleEdit('meetingInfo')}>Cancel</CancelButton>
                </div>
              </InformationContainer>
            ) : (
              <InformationContainer>
                <p>Date and Time: {meetingInformation.dateAndTime}</p>
                <p>Venue: {meetingInformation.venue}</p>
                <p>Duration: {meetingInformation.duration}</p>
                <p>Requested by: {meetingInformation.requestedBy}</p>
                <div style={{ textAlign: 'right' }}>
                  <SaveButton onClick={() => handleSave('meetingInfo')}>Edit</SaveButton>
                </div>
              </InformationContainer>
            )}
          </Section>
          
          {/* Attendees Section */}
          <Section>
            <h2>Attendees</h2>
            <InformationContainer>
            {editMode.attendees ? (
              <>
                {attendees.map((attendee, index) => (
                  renderEditableField(attendee, (e) => handleAttendeesChange(index, e.target.value), `attendee-${index}`)
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SaveButton onClick={() => handleSave('attendees')}>Save</SaveButton>
                  <CancelButton onClick={() => toggleEdit('attendees')}>Cancel</CancelButton>
                </div>
              </>
            ) : (
              <>
                <List>
                  {attendees.map((attendee, index) => (
                    <ListItem key={index}>
                      <CustomBullet /> {attendee}
                    </ListItem>
                  ))}
                </List>
                <div style={{ textAlign: 'right' }}>
                  <SaveButton onClick={() => handleSave('attendees')}>Edit</SaveButton>
                </div>
              </>
            )}
          </InformationContainer>
          </Section>
          
          {/* Meeting Purpose Section (Objective & Desired Outcome) */}
          <Section>
            <h2>Meeting Purpose</h2>
            <InformationContainer>
            {editMode.meetingPurpose ? (
              <>
                {agenda.map((item, index) => (
                  renderEditableField(item, (e) => handleAgendaChange(index, e.target.value), `agenda-${index}`)
                ))}
                {renderEditableField(meetingSummary, handleDesiredOutcomeChange, 'meetingSummary')}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SaveButton onClick={() => handleSave('meetingPurpose')}>Save</SaveButton>
                  <CancelButton onClick={() => toggleEdit('meetingPurpose')}>Cancel</CancelButton>
                </div>
              </>
            ) : (
              <>
                <h3>Objective</h3>
                <List>
                  {agenda.map((item, index) => (
                    <ListItem key={index}>
                      <CustomBullet /> {item}
                    </ListItem>
                  ))}
                </List>
                <h3>Meeting Summary</h3>
                <p>
                  <CustomBullet /> {meetingSummary}
                </p>
                <div style={{ textAlign: 'right' }}>
                  <SaveButton onClick={() => handleSave('meetingPurpose')}>Edit</SaveButton>
                </div>
              </>
            )}
            </InformationContainer>
          </Section>
          
          {/* Action Items Section (Deliverables & Assignments) */}
          <Section>
          <h2>Action Items</h2>
          <InformationContainer>
            {editMode.actionItems ? (
              <>
                <h3>Deliverables</h3>
                {deliverables.map((item, index) => (
                  renderEditableField(item, (e) => handleDeliverablesChange(index, e.target.value), `deliverable-${index}`)
                ))}
                <h3>Assignments</h3>
                {assignments.map((item, index) => (
                  renderEditableField(item, (e) => handleAssignmentsChange(index, e.target.value), `assignment-${index}`)
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SaveButton onClick={() => handleSave('actionItems')}>Save</SaveButton>
                  <CancelButton onClick={() => toggleEdit('actionItems')}>Cancel</CancelButton>
                </div>
              </>
            ) : (
              <>
                <h3>Deliverables</h3>
                <List>
                  {deliverables.map((item, index) => (
                    <ListItem key={`deliverable-${index}`}>
                      <CustomBullet />{item}
                    </ListItem>
                  ))}
                </List>
                <h3>Assignments</h3>
                <List>
                  {assignments.map((item, index) => (
                    <ListItem key={`assignment-${index}`}>
                      <CustomBullet />{item}
                    </ListItem>
                  ))}
                </List>
                <div style={{ textAlign: 'right' }}>
                  <SaveButton onClick={() => handleSave('actionItems')}>Edit</SaveButton>
                </div>
              </>
            )}
          </InformationContainer>

          </Section>
          
        </Section>
      </Column>
    <Column style={{ flex: 5 }}>
    {/* Email Preview Section */}
    <Section>
          <PreviewHeader>Email Preview</PreviewHeader>
          <EmailPreview>
            <PreviewSection style={{ backgroundColor: editedSections.email_list ? '#d4edda' : 'transparent' }}>
              <PreviewLabel>To:</PreviewLabel>
              <PreviewList>
                {email_list.split(', ').map((email, index) => (
                  <PreviewItem key={index}>{email}</PreviewItem>
                ))}
              </PreviewList>
            </PreviewSection>
            <PreviewSection style={{ backgroundColor: editedSections.meetingInfo ? '#d4edda' : 'transparent' }}>
              <PreviewLabel>Meeting Information:</PreviewLabel>
              <PreviewList>
                <PreviewItem>Date and Time: {meetingInformation.dateAndTime}</PreviewItem>
                <PreviewItem>Venue: {meetingInformation.venue}</PreviewItem>
                <PreviewItem>Duration: {meetingInformation.duration}</PreviewItem>
                <PreviewItem>Requested by: {meetingInformation.requestedBy}</PreviewItem>
              </PreviewList>
            </PreviewSection>
            <PreviewSection style={{ backgroundColor: editedSections.attendees ? '#d4edda' : 'transparent' }}>
              <PreviewLabel>Attendees:</PreviewLabel>
              <PreviewList>
                {attendees.map((attendee, index) => (
                  <PreviewItem key={index}>{attendee}</PreviewItem>
                ))}
              </PreviewList>
            </PreviewSection>
            <PreviewSection style={{ backgroundColor: editedSections.meetingPurpose ? '#d4edda' : 'transparent' }}>
              <PreviewLabel>Meeting Purpose:</PreviewLabel>
              <PreviewList>
                {agenda.map((item, index) => (
                  <PreviewItem key={index}>{item}</PreviewItem>
                ))}
              </PreviewList>
              <p>
                <strong>Meeting Minutes:</strong> {meetingSummary}
              </p>
            </PreviewSection>
            <PreviewSection  style={{ backgroundColor: editedSections.actionItems ? '#d4edda' : 'transparent' }}>
              <PreviewLabel>Action Items:</PreviewLabel>
              <PreviewList>
                {deliverables.map((item, index) => (
                  <PreviewItem key={`deliverable-${index}`}>{item}</PreviewItem>
                ))}
              </PreviewList>
              <PreviewList>
                {assignments.map((item, index) => (
                  <PreviewItem key={`assignment-${index}`}>{item}</PreviewItem>
                ))}
              </PreviewList>
            </PreviewSection>
          </EmailPreview>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {/* <RegenerateButton onClick={() => navigate('/loading', { state: { email_list, meetingInformation, attendees, language, agenda, meetingSummary, deliverables, assignments } })}>
              Regenerate LLM
            </RegenerateButton> */}
            <RegenerateButton onClick={handleSubmit}>
              Regenerate LLM
            </RegenerateButton>
            <LanguageButton onClick={handleChangeLanguage}>
              Change Language
            </LanguageButton>
            <ConfirmButton onClick={() => navigate('/confirmation')}>
              Confirm and Send to Email
            </ConfirmButton>
          </div>
        </Section>
      </Column>
    </PageContainer>
  );
}

export default Review;

// TODO: regenerate, send EmailPreview, language
import React, { useState, useEffect } from 'react';
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
  agenda?: string;
  meetingSummary?: string;
  actionables?: Actionable[]; // Ensure this matches the JSON structure
  doc_id_list?: string[];
  collection_id?: string;
  chat_session_id?: string;
  meetingRequester?: string;
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
  const [docIdList, setDocIdList] = useState<string[]>(locationState.doc_id_list ?? []);
  const [collectionId, setCollectionId] = useState<string>(locationState.collection_id ?? 'dsf');
  const [chatSessionId, setChatSessionId] = useState<string>(locationState.chat_session_id ?? '');
  const [meetingRequester, setMeetingRequester] = useState<string>(locationState.meetingRequester ?? '');


  const [meetingInformation, setMeetingInformation] = useState({
    dateAndTime: '19/3/2024 10:00-12:00',
    requestedBy: meetingRequester,
  });

  useEffect(() => {
    if (attachment) {
      // Convert lastModified to a Date object
      const lastModifiedDate = new Date(attachment.lastModified);

      // Format the date as you need it for your application
      const formattedDate = `${lastModifiedDate.getDate()}/${
        lastModifiedDate.getMonth() + 1
      }/${lastModifiedDate.getFullYear()} ${lastModifiedDate.getHours()}:${lastModifiedDate.getMinutes()}`;
      setMeetingInformation((prevInfo) => ({
        ...prevInfo,
        dateAndTime: formattedDate,
      }));
    }
  }, [attachment]);
  const [language, setLanguages] = useState<string[]>(locationState.language ? [locationState.language] : []);
  const [agenda, setAgenda] = useState<string[]>(locationState.agenda?.split(", ") || []);
  const [meetingSummary, setDesiredOutcome] = useState<string>(locationState.meetingSummary ?? '');

  const [assignments, setAssignments] = useState<string[]>(() => {
    // If actionables is defined
    return locationState.actionables
      ? locationState.actionables.map(a => `${a.Assigned}: ${a.Action} (${a.Priority}, ${a.Deadline})`)
      : []; // Default to an empty array if actionables is undefined
  });

  const sendEmail = () => {
    // Validate that necessary information is available
    if (!email_list || !language) {
      alert("Please provide at least one email address and select a language.");
      return;
    }

    const actionablesData: Actionable[] = locationState.actionables ?? [];
  
    // Prepare the data to be sent, including language_preferences
    const jsonPayload = {
      'Agenda': agenda.join(", "),
      'Meeting Summary': meetingSummary,
      'Actionables': actionablesData,
      'language_preferences': language,
      'email_list': email_list.split(', '),
      'requested_by': meetingInformation.requestedBy,
      'doc_id_list': docIdList,
      'collection_id': collectionId,
      'chat_session_id': chatSessionId,
      'meeting_date': meetingInformation.dateAndTime, 
    };

    const jsonData = JSON.stringify(jsonPayload);
    console.log(jsonPayload);
    navigate('/loading', { state: { attachment, language, email_list } });
  
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/send_email', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
  
    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('Email sent successfully');
        navigate('/confirmation');
      } else {
        console.error('Error caught:', xhr.statusText);
      }
    };
  
    xhr.onerror = () => {
      console.error('An error occurred during the transaction');
    };
    xhr.send(jsonData);
  };
  
  const handleSubmit = () => {
    if (!attachment || !email_list) {
      alert("Please provide an attachment and at least one email address.");
      return;
    }
  
    // Create the JSON payload to send
    const jsonPayload = {
      'file': attachment, 
      'language': Array.isArray(language) ? language : [language], // Ensure language is an array
      'email_list': email_list.split(', '),
      'agenda': agenda,
      'meetingSummary': meetingSummary,
      'actionables': assignments,
      'doc_id_list': docIdList,
      'collection_id': collectionId,
      'chat_session_id': chatSessionId,
    };
  
    const jsonData = JSON.stringify(jsonPayload);
  
    navigate('/loading', { state: { attachment, language, email_list } });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/meeting_chat', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
  
    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('Chat processed successfully');
        const response = JSON.parse(xhr.responseText);
        const agenda = response.Agenda;
        const meetingSummary = response['Meeting Summary'];
        const actionables = response.Actionables;
        
        // Navigate to the review page when the request is successful
        navigate('/review', { state: { agenda, meetingSummary, actionables, attachment, language, email_list,
           doc_id_list: docIdList, collection_id: collectionId, chat_session_id: chatSessionId, meetingRequester: meetingInformation.requestedBy } });
      } else {
        console.error('Error caught:', xhr.statusText);
        // Handle any errors here
      }
    };
  
    xhr.onerror = () => {
      console.error('An error occurred during the transaction');
      // Handle the error
    };
  
    xhr.send(jsonData); // Send the JSON payload
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

  const handleAgendaChange = (index: number, value: string) => {
    setAgenda(prevAgenda => prevAgenda.map((item, i) => i === index ? value :item));
  };
  
  const handleDesiredOutcomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setDesiredOutcome(e.target.value);
  };
  
  const handleAssignmentsChange = (index: number, value: string) => {
    setAssignments((prevAssignments) => prevAssignments.map((item, i) => i === index ? value : item));
  };

  const handleEmailAddressesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddresses(e.target.value);
  };


// Improved addLanguage function with proper TypeScript typing
const addLanguage = (newLanguages: string[]) => {
  setLanguages((prevLanguages) => {
    // Combine the previous and new languages, and remove duplicates
    const updatedLanguages = new Set([...prevLanguages, ...newLanguages]);
    return Array.from(updatedLanguages);
  });
};

const handleChangeLanguage = () => {
  // Prompt the user to enter new languages, separated by commas
  const userInput = prompt('Enter new languages (e.g., English, Spanish), separated by commas:');
  if (userInput) {
    // Split the string by commas, trim whitespace, and filter out any empty strings
    const newLanguages = userInput.split(',')
                                  .map(lang => lang.trim())
                                  .filter(lang => lang !== '');
    addLanguage(newLanguages);
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
                {renderEditableField(meetingInformation.requestedBy, (e) => handleMeetingInfoChange(e, 'requestedBy'), 'requestedBy')}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SaveButton onClick={() => handleSave('meetingInfo')}>Save</SaveButton>
                  <CancelButton onClick={() => toggleEdit('meetingInfo')}>Cancel</CancelButton>
                </div>
              </InformationContainer>
            ) : (
              <InformationContainer>
                <p>Date and Time: {meetingInformation.dateAndTime}</p>
                <p>Requested by: {meetingInformation.requestedBy}</p>
                <div style={{ textAlign: 'right' }}>
                  <SaveButton onClick={() => handleSave('meetingInfo')}>Edit</SaveButton>
                </div>
              </InformationContainer>
            )}
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
          
          {/* Action Items Section (Assignments) */}
          <Section>
          <h2>Action Items</h2>
          <InformationContainer>
            {editMode.actionItems ? (
              <>
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
                <PreviewItem>Requested by: {meetingInformation.requestedBy}</PreviewItem>
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
                {assignments.map((item, index) => (
                  <PreviewItem key={`assignment-${index}`}>{item}</PreviewItem>
                ))}
              </PreviewList>
            </PreviewSection>
          </EmailPreview>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <RegenerateButton onClick={handleSubmit}>
              Regenerate LLM
            </RegenerateButton>
            <LanguageButton onClick={handleChangeLanguage}>
              Add Language
            </LanguageButton>
            <ConfirmButton onClick={sendEmail}>
              Confirm and Send to Email
            </ConfirmButton>
          </div>
        </Section>
      </Column>
    </PageContainer>
  );
}

export default Review;
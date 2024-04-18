import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as MeetingAssistantIcon } from './icons/meeting-assistant-icon.svg';
import Images from "./images/meeting_assistant_workflow_nolegend.png";
import Sample_Output from "./images/photo_2024-04-18_15-50-39.jpg";
import Japanese from "./images/japanese.png";

const Container = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  font-size: 16px;
  color: #fff;
  margin-bottom: 5px;
  display: block;
`;

const Title = styled.h3`
  margin-bottom: 15px;
  font-size: 24px;
  color: #333;
`;

const Description = styled.p`
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const HowItWorksHeader = styled.h2`
  font-size: 24px;
  margin-top: 40px; /* Adjust as necessary for your layout */
  margin-bottom: 20px;
  text-align: center;
`;

const HowItWorksImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto; /* Centers image in the container */
`;

const Footnote = styled.p`
  font-size: 12px;
  color: #666;
  text-align: left;
  margin-top: 20px; // Adjust the margin as needed
  padding-left: 20px;
`;


function StartScreen() {
  const navigate = useNavigate();
  const location = useLocation(); // this hook is used to access the state passed from navigate function
  const [attachment, setAttachment] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>('English');
  const [email_list, setEmailAddresses] = useState<string>('');
  const [meetingRequester, setMeetingRequester] = useState<string>('');

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
      // Assume the responseText is a JSON string and parse it
      const result = JSON.parse(xhr.responseText);
      console.log(result.message);
      
      // No need to parse result again if it's already a JavaScript object
      // Directly use the result object to extract data
      const agenda = result.Agenda;
      const meetingSummary = result['Meeting Summary'];
      const actionables = result.Actionables;
      const doc_id_list = result.doc_id_list;
      const collection_id = result.collection_id;
      const chat_session_id = result.chat_session_id;
      
      // Navigate to the review page when the request is successful
      navigate('/review', { state: { agenda, meetingSummary, actionables, attachment, language, email_list, doc_id_list, collection_id, chat_session_id, meetingRequester } });
    } else {
      console.error('Error caught:', xhr.statusText);
    }
  };

  xhr.onerror = () => {
    console.error('An error occurred during the transaction');
  };

  xhr.send(formData);
};


  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachment(event.target.files[0]);
    }
  };

  return (
    <>
      <Container>
        <Title>Welcome!</Title>
        <Description>
          Send in your meeting transcript and we will generate post meeting minutes for you.
          <ul>
            <li>Identifies action items and highlights key discussion points.</li>
            <li>Sends summaries to all attendees via email automatically.</li>
            <li>Translates minutes to your desired languages.</li>
            <li>Enhances teamwork and efficiency in team sessions or professional meetings.</li>
          </ul>
          <Footnote>*Refer below for sample output</Footnote>
        </Description>
      </Container>
      <br />
      <Container>
        <Title>Meeting Transcription Submission</Title>
        <Label htmlFor="file-upload">Add Meeting Transcript here:</Label>
        <Input
          id="file-upload"
          type="file"
          accept=".ppt,.pptx,.pdf,.txt,.mp3,.wav"
          onChange={handleAttachmentChange}
        />
        <Label htmlFor="meeting-requester">Meeting Requester Name:</Label>
        <Input
          id="meeting-requester"
          type="text"
          value={meetingRequester}
          onChange={(e) => setMeetingRequester(e.target.value)}
          placeholder="Meeting Requester"
        />
        <Label htmlFor="email-list">Emails of participants:</Label>
        <Input
          id="email-list"
          type="text"
          value={email_list}
          onChange={(e) => setEmailAddresses(e.target.value)}
          placeholder="e.g., example1@mail.com, example2@mail.com"
        />
        <Button onClick={handleSubmit}>Submit Meeting Minutes</Button>
      </Container>
      <Container>
        <HowItWorksHeader>How It Works</HowItWorksHeader>
        <HowItWorksImage src={ Images } alt='How it works diagram' />
      </Container>
      <Container>
        <HowItWorksHeader>Sample of Output</HowItWorksHeader>
        <HowItWorksImage src={ Sample_Output } alt='Output Sameple' />
      </Container>
      <Container>
        <HowItWorksHeader>Sample Translated Meeting Minutes</HowItWorksHeader>
        <HowItWorksImage src={ Japanese } alt='Sample Translated Meeting Minutes' />
      </Container>
    </>
  );
}



export default StartScreen;


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as MeetingAssistantIcon } from './icons/meeting-assistant-icon.svg';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    <br></br>
    <Container>
      
      <Title>Welcome!</Title>
      <Description>Our Meeting Assistant is designed to ease post-meeting processes by creating summaries, 
        identifying action items, and emphasizing crucial discussion points automatically. 
        This tool is crafted to bolster teamwork and increase efficiency during team sessions or 
        professional meet-ups. Automatically, it dispatches insightful summaries to all attendees via email.
        </Description>
    </Container>
    <br></br>
    <Container>
      <Title>Meeting Minutes Submission</Title>
      <Input type="file" accept=".ppt,.pptx,.pdf,.txt,.mp3,.wav" onChange={handleAttachmentChange} />
      <Input 
        type="text" 
        value={meetingRequester} 
        onChange={(e) => setMeetingRequester(e.target.value)} 
        placeholder="Meeting Requester"
      />
      <Input type="text" value={email_list} onChange={(e) => setEmailAddresses(e.target.value)} placeholder="e.g., example1@mail.com, example2@mail.com" />
      <Button onClick={handleSubmit}>Submit Meeting Minutes</Button>
    </Container>
    </>
  );
}

export default StartScreen;

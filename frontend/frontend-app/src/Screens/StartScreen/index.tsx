import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [attachment, setAttachment] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>('English');
  const [emailAddresses, setEmailAddresses] = useState<string>('');

  const handleSubmit = () => {
    if (!attachment || !emailAddresses) {
      alert("Please provide an attachment and at least one email address.");
      return;
    }

    console.log({
      attachment,
      language,
      emailAddresses,
    });
    navigate('/loading', { state: { attachment, language, emailAddresses } });

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
      <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="English">English</option>
        <option value="Chinese">Chinese</option>
        <option value="French">French</option>
        {/* Add more languages as options here */}
      </Select>
      <Input type="text" value={emailAddresses} onChange={(e) => setEmailAddresses(e.target.value)} placeholder="e.g., example1@mail.com, example2@mail.com" />
      <Button onClick={handleSubmit}>Submit Meeting Minutes</Button>
    </Container>
    </>
  );
}

export default StartScreen;

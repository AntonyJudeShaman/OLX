import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { Container, TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { Delete, ThumbUp, ThumbDown, ThumbUpOffAlt, ThumbDownOffAlt } from '@mui/icons-material';

const ENDPOINT = "http://localhost:5000";

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  itemId: string;
  message: string;
  likes: number;
  dislikes: number;
}

interface ChatAppProps {
  itemId: string;
  currentUser: string;
  chatWith: string;
}

const ChatApp: React.FC<ChatAppProps> = ({ itemId, currentUser, chatWith }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    axios.get<Message[]>(`${ENDPOINT}/api/chat/messages/${itemId}/${currentUser}/${chatWith}`)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }, [itemId, currentUser, chatWith]);

  const sendMessage = () => {
    const message = {
      sender: currentUser,
      receiver: chatWith,
      itemId,
      message: newMessage
    };

    axios.post(`${ENDPOINT}/api/chat/messages`, message)
      .then(response => {
        setNewMessage('');
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  const deleteMessage = (id: string) => {
    axios.delete(`${ENDPOINT}/api/chat/messages/${id}`)
      .then(response => {
        setMessages(messages.filter(message => message._id !== id));
      })
      .catch(error => {
        console.error('Error deleting message:', error);
      });
  };

  const likeMessage = (id: string) => {
    axios.post(`${ENDPOINT}/api/chat/messages/${id}/like`)
      .then(response => {
        setMessages(messages.map(message => message._id === id ? response.data : message));
      })
      .catch(error => {
        console.error('Error liking message:', error);
      });
  };

  const dislikeMessage = (id: string) => {
    axios.post(`${ENDPOINT}/api/chat/messages/${id}/dislike`)
      .then(response => {
        setMessages(messages.map(message => message._id === id ? response.data : message));
      })
      .catch(error => {
        console.error('Error disliking message:', error);
      });
  };

  const unlikeMessage = (id: string) => {
    axios.post(`${ENDPOINT}/api/chat/messages/${id}/unlike`)
      .then(response => {
        setMessages(messages.map(message => message._id === id ? response.data : message));
      })
      .catch(error => {
        console.error('Error unliking message:', error);
      });
  };

  const undislikeMessage = (id: string) => {
    axios.post(`${ENDPOINT}/api/chat/messages/${id}/undislike`)
      .then(response => {
        setMessages(messages.map(message => message._id === id ? response.data : message));
      })
      .catch(error => {
        console.error('Error undisliking message:', error);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Chat Application</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((msg) => (
          <Box key={msg._id} sx={{ border: '1px solid #ccc', borderRadius: '8px', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body1"><strong>{msg.sender}</strong>: {msg.message}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => likeMessage(msg._id)} color="primary"><ThumbUp /> {msg.likes}</IconButton>
              <IconButton onClick={() => dislikeMessage(msg._id)} color="secondary"><ThumbDown /> {msg.dislikes}</IconButton>
              <IconButton onClick={() => unlikeMessage(msg._id)} color="primary"><ThumbUpOffAlt /></IconButton>
              <IconButton onClick={() => undislikeMessage(msg._id)} color="secondary"><ThumbDownOffAlt /></IconButton>
              <IconButton onClick={() => deleteMessage(msg._id)} color="error"><Delete /></IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={sendMessage}>Send</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ChatApp;

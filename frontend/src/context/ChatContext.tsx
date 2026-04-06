import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  id: string;
  sender: string;
  timestamp: number;
  encryptedText: string;
  isImage?: boolean; // Support for inline base64 images
  edited: boolean;
}

interface ChatContextProps {
  socket: Socket | null;
  username: string | null;
  setUsername: (name: string | null) => void;
  groupId: string | null;
  setGroupId: (id: string | null) => void;
  messages: ChatMessage[];
  members: string[];
  systemMessages: string[];
  sendMessage: (encryptedText: string, isImage?: boolean) => void;
  editMessage: (messageId: string, newEncryptedText: string) => void;
  leaveGroup: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};

// Connect to self based on environment so free hosting handles the websocket properly
const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:3001' : '/';

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsernameState] = useState<string | null>(localStorage.getItem('username'));
  const [groupId, setGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [systemMessages, setSystemMessages] = useState<string[]>([]);

  const setUsername = (name: string | null) => {
    if (name) localStorage.setItem('username', name);
    else localStorage.removeItem('username');
    setUsernameState(name);
  };

  useEffect(() => {
    // Connect to server
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('update-members', (newMembers: string[]) => {
      setMembers(newMembers);
    });

    socket.on('chat-history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on('new-message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('message-edited', ({ messageId, newEncryptedText, edited }) => {
      setMessages((prev) => prev.map(m => m.id === messageId ? { ...m, encryptedText: newEncryptedText, edited } : m));
    });

    socket.on('system-message', (msg: string) => {
      setSystemMessages(prev => [...prev, msg]);
      // Also add as a system message to main chat
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'SYSTEM', timestamp: Date.now(), encryptedText: msg, edited: false }]);
    });

    socket.on('error', (err: string) => {
      console.error("Socket error:", err);
      alert(err);
    });

    return () => {
      socket.off('update-members');
      socket.off('chat-history');
      socket.off('new-message');
      socket.off('message-edited');
      socket.off('system-message');
      socket.off('error');
    };
  }, [socket]);

  useEffect(() => {
    if (socket && groupId && username) {
      socket.emit('join-group', { groupId, username });
    }
  }, [socket, groupId, username]);

  const sendMessage = (encryptedText: string, isImage: boolean = false) => {
    if (socket && groupId) {
      socket.emit('send-message', {
        id: Date.now().toString(),
        sender: username,
        timestamp: Date.now(),
        encryptedText,
        isImage
      });
    }
  };

  const editMessage = (messageId: string, newEncryptedText: string) => {
    if (socket && groupId) {
      socket.emit('edit-message', {
        messageId,
        newEncryptedText
      });
    }
  };

  const leaveGroup = () => {
    if (socket && groupId) {
      socket.emit('leave-group'); // Server removes based on disconnect/leave
    }
    setGroupId(null);
    setMessages([]);
    setMembers([]);
  };

  return (
    <ChatContext.Provider value={{
      socket,
      username,
      setUsername,
      groupId,
      setGroupId,
      messages,
      members,
      systemMessages,
      sendMessage,
      editMessage,
      leaveGroup
    }}>
      {children}
    </ChatContext.Provider>
  );
};

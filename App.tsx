import React, { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import PersonaSelector from './components/PersonaSelector';
import ChatInterface from './components/ChatInterface';
import NLPVisualizer from './components/NLPVisualizer';
import { UserProfile, PersonaConfig, Message } from './types';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import { getStoredChat, saveChatToStorage, deleteStoredChat } from './services/storage';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaConfig | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedPersona(null);
  };

  const handleSelectPersona = async (persona: PersonaConfig) => {
    if (!user) return;
    try {
        await initializeChat(user.apiKey, persona);
        setSelectedPersona(persona);
        
        // Load chat history
        const history = getStoredChat(user.uniqueId, persona.id);
        setMessages(history);

    } catch (error) {
        console.error("Failed to initialize chat", error);
        alert("Failed to initialize API. Please check your key.");
    }
  };

  const handleBackToPersonas = () => {
    setSelectedPersona(null);
  };

  const handleDeleteChat = () => {
    if (user && selectedPersona) {
      deleteStoredChat(user.uniqueId, selectedPersona.id);
      setMessages([]);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!user || !selectedPersona) return;

    const newMessage: Message = {
      id: uuidv4(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    const updatedMessagesWithUser = [...messages, newMessage];
    setMessages(updatedMessagesWithUser);
    saveChatToStorage(user.uniqueId, selectedPersona.id, updatedMessagesWithUser);
    
    setIsProcessing(true);

    try {
      const responseText = await sendMessageToGemini(text);
      
      const responseMessage: Message = {
        id: uuidv4(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      const updatedMessagesWithModel = [...updatedMessagesWithUser, responseMessage];
      setMessages(updatedMessagesWithModel);
      saveChatToStorage(user.uniqueId, selectedPersona.id, updatedMessagesWithModel);

    } catch (error) {
      console.error("Error generating response", error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'model',
        text: "I'm having trouble connecting to my neural core right now. Please check your API key or internet connection.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (!selectedPersona) {
    return <PersonaSelector onSelect={handleSelectPersona} userName={user.name} onLogout={handleLogout} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Main Chat Area - Takes full width on mobile, less on desktop */}
      <div className="flex-1 h-full relative z-10 transition-all duration-300">
        <ChatInterface 
          user={user}
          persona={selectedPersona}
          messages={messages}
          onSendMessage={handleSendMessage}
          onBack={handleBackToPersonas}
          onDeleteChat={handleDeleteChat}
          isProcessing={isProcessing}
        />
      </div>

      {/* NLP Visualizer - Hidden on small mobile screens, visible on desktop */}
      <div className="hidden lg:block w-80 h-full border-l border-gray-800 bg-gray-900 z-0">
        <NLPVisualizer 
          isProcessing={isProcessing}
          steps={[]}
        />
      </div>
    </div>
  );
}

export default App;
import React, { useState, useRef, useEffect } from 'react';
import { Message, PersonaConfig, UserProfile } from '../types';
import { Send, ArrowLeft, Trash2, Paperclip, Mic } from 'lucide-react';
import { ICON_MAP } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  user: UserProfile;
  persona: PersonaConfig;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  onDeleteChat: () => void;
  isProcessing: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  user, 
  persona, 
  messages, 
  onSendMessage, 
  onBack,
  onDeleteChat,
  isProcessing
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const PersonaIcon = ICON_MAP[persona.icon];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isProcessing) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 relative">
      {/* Header */}
      <header className="h-16 border-b border-gray-800 bg-gray-900/90 backdrop-blur flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${persona.color} flex items-center justify-center shadow-lg`}>
              <PersonaIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">{persona.name}</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => {
            if(window.confirm("Are you sure you want to delete this chat history?")) {
              onDeleteChat();
            }
          }}
          className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-full transition-colors"
          title="Delete Conversation"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
            <PersonaIcon className="w-16 h-16 mb-4" />
            <p>Start a conversation with {persona.name}</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-md ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-sm' 
                : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'
            }`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              <div className={`text-[10px] mt-1 text-right ${
                msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}
        {/* Typing indicator */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-700 flex gap-1 items-center">
                 <div className="text-xs text-gray-500 mr-2">{persona.name} is typing</div>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
           <button type="button" className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors">
              <Paperclip className="w-5 h-5" />
           </button>
           
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${persona.name}...`}
            className="flex-1 bg-gray-800 text-white placeholder-gray-500 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            disabled={isProcessing}
          />
          
          {inputText.trim() ? (
            <button 
              type="submit" 
              disabled={isProcessing}
              className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
             <button type="button" className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors">
                <Mic className="w-5 h-5" />
             </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
import React from 'react';
import { PERSONAS, ICON_MAP } from '../constants';
import { PersonaConfig } from '../types';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

interface PersonaSelectorProps {
  onSelect: (persona: PersonaConfig) => void;
  userName: string;
  onLogout: () => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelect, userName, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-900 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
            <div className="text-left">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-2"
                >
                    Welcome, {userName}
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-400"
                >
                    Select a persona to begin your conversation
                </motion.p>
            </div>
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/30 transition-all"
            >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
            </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERSONAS.map((persona, index) => {
            const Icon = ICON_MAP[persona.icon];
            return (
              <motion.button
                key={persona.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(persona)}
                className="group relative bg-gray-800 border border-gray-700 rounded-2xl p-6 text-left hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                   <Icon size={120} className="text-white transform rotate-12 translate-x-4 -translate-y-4" />
                </div>
                
                <div className={`${persona.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="text-white w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {persona.name}
                </h3>
                <p className="text-gray-400 leading-relaxed relative z-10">
                  {persona.description}
                </p>
                
                <div className="mt-6 flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                  <span>Start Chatting</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PersonaSelector;
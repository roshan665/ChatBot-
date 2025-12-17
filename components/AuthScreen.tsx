import React, { useState } from 'react';
import { UserProfile } from '../types';
import { KeyRound, UserCircle, Fingerprint, Calendar, Users, LogIn, UserPlus, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStoredUsers, saveUserToStorage } from '../services/storage';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    uniqueId: '',
    age: '',
    gender: 'Not Specified',
    apiKey: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.uniqueId || !formData.apiKey) {
      alert("Please fill in all required fields.");
      return;
    }

    const users = getStoredUsers();
    if (users[formData.uniqueId]) {
        alert("This Unique ID is already taken. Please choose another.");
        return;
    }

    const newUser: UserProfile = {
      name: formData.name,
      uniqueId: formData.uniqueId,
      age: parseInt(formData.age) || 0,
      gender: formData.gender,
      apiKey: formData.apiKey
    };

    saveUserToStorage(newUser);
    onLogin(newUser);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const users = getStoredUsers();
      const user = users[formData.uniqueId];

      if (user) {
          // If the user didn't have an API key stored (legacy), or we want to update it
          // For simplicity in this demo, we assume stored user is valid.
          // If API key is missing in storage, we might want to prompt for it, 
          // but let's assume registration required it.
          onLogin(user);
      } else {
          alert("User not found. Please register first.");
      }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
            <KeyRound className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Access Portal</h1>
          <p className="text-gray-400">Identify yourself to initialize the AI Core.</p>
        </div>

        <div className="flex bg-gray-900/50 p-1 rounded-xl mb-6">
            <button 
                onClick={() => setIsLoginMode(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLoginMode ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
                Login
            </button>
            <button 
                onClick={() => setIsLoginMode(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLoginMode ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
                Register
            </button>
        </div>

        {isLoginMode ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4" /> Unique ID
                    </label>
                    <input
                    type="text"
                    name="uniqueId"
                    placeholder="Enter your unique ID"
                    value={formData.uniqueId}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 transform hover:scale-[1.02] transition-all duration-200"
                >
                    <span className="flex items-center justify-center gap-2"><LogIn size={18} /> Login</span>
                </button>
            </form>
        ) : (
            <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <UserCircle className="w-4 h-4" /> Full Name
                </label>
                <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Fingerprint className="w-4 h-4" /> Unique ID
                </label>
                <input
                type="text"
                name="uniqueId"
                placeholder="Create a unique username"
                value={formData.uniqueId}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Age
                </label>
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    required
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Gender
                </label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                >
                    <option value="Not Specified">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                </select>
                </div>
            </div>

            <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-blue-400 flex items-center gap-2">
                        <KeyRound className="w-4 h-4" /> Gemini API Key
                    </label>
                    <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors underline decoration-purple-400/50 hover:decoration-purple-300"
                    >
                        Get Key <ExternalLink size={10} />
                    </a>
                </div>
                <input
                type="password"
                name="apiKey"
                placeholder="AIzaSy..."
                value={formData.apiKey}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-200 mt-4"
            >
                <span className="flex items-center justify-center gap-2"><UserPlus size={18} /> Register User</span>
            </button>
            </form>
        )}
      </motion.div>
    </div>
  );
};

export default AuthScreen;
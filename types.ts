export interface UserProfile {
  name: string;
  uniqueId: string;
  age: number;
  gender: string;
  apiKey: string;
}

export enum PersonaType {
  FRIEND = 'Friend',
  BESTIE = 'Bestie',
  TUTOR = 'Tutor',
  STORYTELLER = 'Storyteller',
  PHILOSOPHER = 'Philosopher',
  COMEDIAN = 'Comedian'
}

export interface PersonaConfig {
  id: PersonaType;
  name: string;
  description: string;
  systemInstruction: string;
  icon: string;
  color: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type NLPStepState = 'idle' | 'active' | 'completed';

export interface NLPStep {
  id: string;
  label: string;
  details: string;
  state: NLPStepState;
}
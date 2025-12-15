export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type FormalityLevel = 'informal' | 'neutral' | 'formal';

export type ConnectorType =
  | 'cause'
  | 'consequence'
  | 'opposition'
  | 'addition'
  | 'time'
  | 'conclusion'
  | 'example'
  | 'emphasis'
  | 'condition'
  | 'comparison';

export interface Example {
  french: string;
  english: string;
  context?: string;
}

export interface Connector {
  id: string;
  term: string;
  translation: string;
  type: ConnectorType[];
  cefrLevel: CEFRLevel;
  formality: FormalityLevel;
  description: string;
  usage: string;
  examples: Example[];
  synonyms?: string[];
  notes?: string;
}

export interface ConnectorMetadata {
  id: string;
  term: string;
  translation: string;
  type: ConnectorType[];
  cefrLevel: CEFRLevel;
  formality: FormalityLevel;
}

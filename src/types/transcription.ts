export interface Word {
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker: null | string;
}

export interface Transcription {
  id: string;
  status: string;
  text: string;
  words: Word[];
}

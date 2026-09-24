// Voice-Activated Remote Control & Audio Sensitivity Service

export interface VoiceTriggerMap {
  keywords: string[];
  emoji: string;
  category: string;
}

export const DEFAULT_VOICE_TRIGGERS: VoiceTriggerMap[] = [
  { keywords: ['ضحك', 'هههه', 'ضحكة', 'تضحك', 'مضحك', 'laugh', 'lol', 'funny', 'haha'], emoji: '😂', category: 'laugh' },
  { keywords: ['بكاء', 'دموع', 'حزن', 'حزين', 'يبكي', 'cry', 'sad', 'tear', 'crying'], emoji: '😭', category: 'cry' },
  { keywords: ['حب', 'قلب', 'احبك', 'غرام', 'عشق', 'love', 'heart', 'like', 'sweet'], emoji: '💖', category: 'heart' },
  { keywords: ['حريق', 'نار', 'ولع', 'ولعت', 'شرار', 'fire', 'flame', 'hot', 'lit'], emoji: '🔥', category: 'fire' },
  { keywords: ['حفلة', 'مبروك', 'احتفال', 'تهاني', 'party', 'cheers', 'dance', 'congrats'], emoji: '🥳', category: 'party' },
  { keywords: ['تصفيق', 'كفو', 'شكرا', 'مبدع', 'ممتاز', 'clap', 'bravo', 'thanks', 'great'], emoji: '👏', category: 'party' },
  { keywords: ['صدمة', 'واو', 'مستحيل', 'مفاجأة', 'عجيب', 'wow', 'shock', 'omg', 'surprise'], emoji: '😱', category: 'shock' },
  { keywords: ['وردة', 'ورد', 'زهور', 'ياسمين', 'rose', 'flower', 'bloom'], emoji: '🌹', category: 'rose' },
];

export class VoiceRemoteManager {
  private recognition: any = null;
  private isListening = false;
  private onTriggerCallback?: (emoji: string, word: string) => void;
  private onErrorCallback?: (err: string) => void;

  constructor(onTrigger?: (emoji: string, word: string) => void, onError?: (err: string) => void) {
    this.onTriggerCallback = onTrigger;
    this.onErrorCallback = onError;
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API is not supported in this browser environment.');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'ar-SA'; // Default to Arabic with fallback to English

      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();
          this.checkKeywords(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Voice Remote Recognition Error:', event.error);
        if (this.onErrorCallback) this.onErrorCallback(event.error);
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            // Silently handle restart
          }
        }
      };
    } catch (err) {
      console.error('Failed to initialize VoiceRemoteManager', err);
    }
  }

  private checkKeywords(transcript: string) {
    for (const trigger of DEFAULT_VOICE_TRIGGERS) {
      for (const kw of trigger.keywords) {
        if (transcript.includes(kw)) {
          if (this.onTriggerCallback) {
            this.onTriggerCallback(trigger.emoji, kw);
          }
          return;
        }
      }
    }
  }

  public startListening() {
    this.isListening = true;
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Recognition already started or permission required', err);
      }
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        // Handle stop error
      }
    }
  }

  public getIsListening() {
    return this.isListening;
  }
}

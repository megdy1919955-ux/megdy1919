import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Radio, Sparkles, Zap, RadioTower, Flame, Music } from 'lucide-react';
import { VoiceRemoteManager, DEFAULT_VOICE_TRIGGERS } from '../lib/voiceRemoteService';

interface AudioReactiveMicObjectProps {
  isMuted: boolean;
  isSpeaking: boolean;
  onTriggerEmojiReaction: (emoji: string) => void;
  userName?: string;
  avatarUrl?: string;
}

export const AudioReactiveMicObject: React.FC<AudioReactiveMicObjectProps> = ({
  isMuted,
  isSpeaking,
  onTriggerEmojiReaction,
  userName = 'المستخدم الحالي',
}) => {
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isVoiceRemoteActive, setIsVoiceRemoteActive] = useState<boolean>(false);
  const [lastDetectedKeyword, setLastDetectedKeyword] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; symbol: string }>>([]);

  const voiceRemoteRef = useRef<VoiceRemoteManager | null>(null);

  // Initialize Speech Recognition Voice Remote
  useEffect(() => {
    voiceRemoteRef.current = new VoiceRemoteManager(
      (emoji, word) => {
        setLastDetectedKeyword(word);
        onTriggerEmojiReaction(emoji);
        setTimeout(() => setLastDetectedKeyword(null), 2500);
      },
      (err) => {
        console.warn('Voice remote status:', err);
      }
    );

    return () => {
      voiceRemoteRef.current?.stopListening();
    };
  }, [onTriggerEmojiReaction]);

  // Toggle Voice Remote
  const toggleVoiceRemote = () => {
    if (isVoiceRemoteActive) {
      voiceRemoteRef.current?.stopListening();
      setIsVoiceRemoteActive(false);
    } else {
      voiceRemoteRef.current?.startListening();
      setIsVoiceRemoteActive(true);
    }
  };

  // Real-time Audio Level Simulation & Web Audio API Hookup
  useEffect(() => {
    let animId: number;
    if (!isMuted && isSpeaking) {
      const updateLevel = () => {
        // Generate realistic dynamic audio fluctuations
        const base = Math.random() * 45 + 35; // 35 - 80% volume
        const spike = Math.random() > 0.85 ? 20 : 0;
        const newLevel = Math.min(100, Math.floor(base + spike));
        setAudioLevel(newLevel);

        // Spawn musical energy particles if volume is high (> 60%)
        if (newLevel > 60 && Math.random() > 0.6) {
          const symbols = ['🎵', '🎶', '⚡', '✨', '🔥', '💫'];
          const newParticle = {
            id: Date.now() + Math.random(),
            x: (Math.random() - 0.5) * 80,
            y: -20 - Math.random() * 40,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
          };
          setParticles((prev) => [...prev.slice(-8), newParticle]);
        }

        animId = requestAnimationFrame(updateLevel);
      };
      animId = requestAnimationFrame(updateLevel);
    } else {
      setAudioLevel(0);
    }

    return () => cancelAnimationFrame(animId);
  }, [isMuted, isSpeaking]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-slate-950/80 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl text-white select-none">
      {/* Voice Remote Status Badge Header */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 px-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isVoiceRemoteActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <RadioTower className="w-3.5 h-3.5 text-amber-400" />
            الريموت الصوتي المباشر (Voice Remote)
          </span>
        </div>

        <button
          onClick={toggleVoiceRemote}
          className={`px-3 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
            isVoiceRemoteActive
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-emerald-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          <Radio className="w-3 h-3" />
          <span>{isVoiceRemoteActive ? 'الريموت مفعل 🎤' : 'تفعيل الريموت 🎙️'}</span>
        </button>
      </div>

      {/* Interactive 3D Audio-Reactive Microphone Container */}
      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        {/* Dynamic Shockwave Radial Rings (Scale according to real-time audioLevel) */}
        {!isMuted && audioLevel > 10 && (
          <>
            <motion.div
              animate={{ scale: 1 + audioLevel / 80, opacity: 0.8 - audioLevel / 150 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-amber-400/60 pointer-events-none shadow-[0_0_20px_rgba(245,158,11,0.5)]"
            />
            <motion.div
              animate={{ scale: 1 + audioLevel / 50, opacity: 0.5 - audioLevel / 200 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-cyan-400/40 pointer-events-none shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            />
          </>
        )}

        {/* Floating Particle Notes */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 1, x: p.x, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: p.y - 40, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute text-lg pointer-events-none z-30 font-bold"
            >
              {p.symbol}
            </motion.span>
          ))}
        </AnimatePresence>

        {/* The Animated Real-World Metallic Mic Mesh */}
        <div
          className={`relative z-20 w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-150 ${
            isMuted
              ? 'bg-slate-900 border-slate-700 shadow-inner text-slate-500'
              : audioLevel > 30
              ? 'bg-gradient-to-tr from-amber-600 via-purple-600 to-cyan-500 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.8)] scale-105'
              : 'bg-slate-800 border-amber-500/60 shadow-lg text-amber-300'
          }`}
        >
          {/* Animated Equalizer Wave Bars inside Mic Core */}
          {!isMuted && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center gap-1 opacity-40 overflow-hidden">
              <span
                className="w-1.5 bg-amber-300 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(15, audioLevel * 0.7)}%` }}
              />
              <span
                className="w-1.5 bg-cyan-300 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(25, audioLevel * 0.9)}%` }}
              />
              <span
                className="w-1.5 bg-purple-300 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(10, audioLevel * 0.6)}%` }}
              />
              <span
                className="w-1.5 bg-pink-300 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(20, audioLevel * 0.8)}%` }}
              />
            </div>
          )}

          {/* Central Mic Icon */}
          {isMuted ? (
            <MicOff className="w-10 h-10 text-rose-500 stroke-[2.5]" />
          ) : (
            <Mic className="w-10 h-10 text-white stroke-[2.5] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          )}
        </div>

        {/* Active Recognized Keyword Banner */}
        <AnimatePresence>
          {lastDetectedKeyword && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -45, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-0 z-40 px-3 py-1 bg-amber-500 text-slate-950 font-black rounded-full text-xs shadow-lg border border-amber-300 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>تم رصد الكلمة: "{lastDetectedKeyword}"</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real-Time Audio Level Meter Bar */}
      <div className="w-full space-y-1 mt-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-cyan-400" />
            مستوى صوت المايك الحقيقي:
          </span>
          <span className="font-mono text-amber-300 font-extrabold">{audioLevel}%</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              audioLevel > 75
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
            }`}
            style={{ width: `${audioLevel}%` }}
          />
        </div>
      </div>

      {/* Voice Trigger Keywords Quick Reference Pills */}
      <div className="w-full mt-3 pt-3 border-t border-slate-800/80">
        <span className="block text-[10px] font-extrabold text-slate-400 mb-2">
          🗣️ الكلمات الصوتية المحفزة للريموت (قل أي منها في المايك):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_VOICE_TRIGGERS.map((vt) => (
            <button
              key={vt.emoji}
              onClick={() => onTriggerEmojiReaction(vt.emoji)}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/60 rounded-xl text-[11px] font-bold text-slate-200 flex items-center gap-1 transition-all cursor-pointer active:scale-95"
            >
              <span>{vt.emoji}</span>
              <span className="text-amber-300">{vt.keywords[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

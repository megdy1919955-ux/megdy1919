import React, { useState } from 'react';
import { Gamepad2, Sparkles, Dices, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from '../types';
import { soundEffects } from '../lib/soundEffects';

interface GamesScreenProps {
  currentUser: User;
  onOpenRecharge: () => void;
}

export const GamesScreen: React.FC<GamesScreenProps> = ({ currentUser, onOpenRecharge }) => {
  const [activeGame, setActiveGame] = useState<'wheel' | 'dice' | 'mystery'>('wheel');

  // Lucky Wheel State
  const [spinning, setSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);

  const wheelPrizes = [
    { label: '500 كوينز 🪙', value: 500, color: 'from-amber-600 to-yellow-500' },
    { label: '1,000 كوينز 🪙', value: 1000, color: 'from-purple-600 to-indigo-500' },
    { label: 'تاج ملكي 👑', value: 2999, color: 'from-amber-500 to-yellow-300' },
    { label: 'حظ أوفر 🍀', value: 0, color: 'from-slate-700 to-slate-600' },
    { label: '5,000 كوينز 💎', value: 5000, color: 'from-emerald-600 to-teal-500' },
    { label: 'سيارة سباق 🏎️', value: 9999, color: 'from-rose-600 to-red-500' }
  ];

  const handleSpinWheel = () => {
    if (spinning) return;
    const cost = 200;
    if (currentUser.coins < cost) {
      onOpenRecharge();
      return;
    }

    currentUser.coins -= cost;
    setSpinning(true);
    setWheelResult(null);

    const randomIndex = Math.floor(Math.random() * wheelPrizes.length);
    const prize = wheelPrizes[randomIndex];
    const newRot = wheelRotation + 1440 + randomIndex * (360 / wheelPrizes.length);
    setWheelRotation(newRot);

    soundEffects.playDiceRoll();

    setTimeout(() => {
      setSpinning(false);
      setWheelResult(prize.label);
      if (prize.value > 0) {
        currentUser.coins += prize.value;
        soundEffects.playVictoryFanfare();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    }, 3000);
  };

  // Dice Battle State
  const [playerDice, setPlayerDice] = useState<number[]>([1, 1]);
  const [botDice, setBotDice] = useState<number[]>([1, 1]);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceResultMsg, setDiceResultMsg] = useState<string | null>(null);

  const handleRollDice = () => {
    if (diceRolling) return;
    const bet = 100;
    if (currentUser.coins < bet) {
      onOpenRecharge();
      return;
    }

    currentUser.coins -= bet;
    setDiceRolling(true);
    setDiceResultMsg(null);
    soundEffects.playDiceRoll();

    setTimeout(() => {
      const p1 = Math.floor(Math.random() * 6) + 1;
      const p2 = Math.floor(Math.random() * 6) + 1;
      const b1 = Math.floor(Math.random() * 6) + 1;
      const b2 = Math.floor(Math.random() * 6) + 1;

      setPlayerDice([p1, p2]);
      setBotDice([b1, b2]);
      setDiceRolling(false);

      const pTotal = p1 + p2;
      const bTotal = b1 + b2;

      if (pTotal > bTotal) {
        currentUser.coins += bet * 2;
        setDiceResultMsg(`مبروك! فزت بـ ${bet * 2} كوينز! 🎉`);
        soundEffects.playVictoryFanfare();
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } else if (pTotal < bTotal) {
        setDiceResultMsg('خسرت الجولة! حظاً أوفر في المرة القادمة 😢');
      } else {
        currentUser.coins += bet;
        setDiceResultMsg('تعادل! تم استرجاع الرهان 🤝');
      }
    }, 1500);
  };

  return (
    <div className="space-y-4 pb-20 max-w-7xl mx-auto px-4 pt-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-extrabold text-white">صالة ألعاب سوبر ليجند 🎮</h2>
        </div>
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs font-bold text-amber-400">
          <span>🪙</span> {currentUser.coins.toLocaleString()}
        </div>
      </div>

      {/* Game Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => setActiveGame('wheel')}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeGame === 'wheel' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          عجلة الحظ الذهبية
        </button>
        <button
          onClick={() => setActiveGame('dice')}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeGame === 'dice' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Dices className="w-4 h-4" />
          تحدي النرد
        </button>
      </div>

      {/* Game 1: Lucky Wheel */}
      {activeGame === 'wheel' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center max-w-md mx-auto shadow-2xl">
          <h3 className="text-base font-extrabold text-white mb-1">عجلة الحظ الأسطورية 🎡</h3>
          <p className="text-xs text-slate-400 mb-6">سعر اللفة: 200 كوينز 🪙 | جوائز وهدايا ملكية كبرى</p>

          {/* Wheel Graphic */}
          <div className="relative w-56 h-56 flex items-center justify-center mb-6">
            <div
              className="w-full h-full rounded-full border-4 border-amber-400 shadow-2xl flex items-center justify-center relative overflow-hidden transition-all duration-[3000ms] ease-out"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                background: 'conic-gradient(#ca8a04 0% 60deg, #7e22ce 60deg 120deg, #eab308 120deg 180deg, #334155 180deg 240deg, #059669 240deg 300deg, #e11d48 300deg 360deg)'
              }}
            >
              <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center z-10 text-xl">
                👑
              </div>
            </div>
            {/* Pointer */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 z-20 filter drop-shadow"></div>
          </div>

          {/* Result Alert */}
          {wheelResult && (
            <div className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-2 rounded-2xl text-xs font-bold mb-4 animate-bounce">
              🎉 ربحت: {wheelResult}
            </div>
          )}

          {/* Spin Button */}
          <button
            onClick={handleSpinWheel}
            disabled={spinning}
            className={`w-full max-w-xs py-3 rounded-2xl font-black text-sm shadow-xl transition transform active:scale-95 cursor-pointer ${
              spinning
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/20 hover:scale-105'
            }`}
          >
            {spinning ? 'جاري الدوران...' : 'تدوير العجلة (200 🪙)'}
          </button>
        </div>
      )}

      {/* Game 2: Dice Challenge */}
      {activeGame === 'dice' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center max-w-md mx-auto shadow-2xl">
          <h3 className="text-base font-extrabold text-white mb-1">معركة النرد التنافسية 🎲</h3>
          <p className="text-xs text-slate-400 mb-6">الرهان: 100 كوينز 🪙 | حقق مجموعاً أعلى من الخصم للفوز بالضعف!</p>

          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            {/* Player Side */}
            <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-4 flex flex-col items-center">
              <span className="text-xs font-bold text-amber-400 mb-2">أنت (اللاعب)</span>
              <div className="flex gap-2">
                <span className="text-4xl bg-slate-900 p-2 rounded-xl border border-slate-700 shadow font-mono">
                  {playerDice[0]}
                </span>
                <span className="text-4xl bg-slate-900 p-2 rounded-xl border border-slate-700 shadow font-mono">
                  {playerDice[1]}
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-2 font-bold font-mono">
                المجموع: {playerDice[0] + playerDice[1]}
              </span>
            </div>

            {/* Opponent Side */}
            <div className="bg-slate-950/80 border border-slate-700 rounded-2xl p-4 flex flex-col items-center">
              <span className="text-xs font-bold text-rose-400 mb-2">الخصم (الأسطورة 🤖)</span>
              <div className="flex gap-2">
                <span className="text-4xl bg-slate-900 p-2 rounded-xl border border-slate-700 shadow font-mono">
                  {botDice[0]}
                </span>
                <span className="text-4xl bg-slate-900 p-2 rounded-xl border border-slate-700 shadow font-mono">
                  {botDice[1]}
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-2 font-bold font-mono">
                المجموع: {botDice[0] + botDice[1]}
              </span>
            </div>
          </div>

          {/* Result Alert */}
          {diceResultMsg && (
            <div className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-2xl text-xs font-bold mb-4">
              {diceResultMsg}
            </div>
          )}

          {/* Roll Button */}
          <button
            onClick={handleRollDice}
            disabled={diceRolling}
            className={`w-full max-w-xs py-3 rounded-2xl font-black text-sm shadow-xl transition transform active:scale-95 cursor-pointer ${
              diceRolling
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/20 hover:scale-105'
            }`}
          >
            {diceRolling ? 'جاري رمي النرد...' : 'رمي النرد (100 🪙)'}
          </button>
        </div>
      )}
    </div>
  );
};

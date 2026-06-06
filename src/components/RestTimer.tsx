import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RestTimer() {
  const [secondsLeft, setSecondsLeft] = useState<number>(90);
  const [initialSeconds, setInitialSeconds] = useState<number>(90);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            triggerAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const triggerAlarm = () => {
    if (!soundEnabled) return;
    try {
      // Use web audio API to generate a beautiful, clean professional synth beep instead of relying on external assets!
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Sequence of clean power notes to signal rest finished
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.15);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.15 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.15);
        osc.stop(audioCtx.currentTime + idx * 0.15 + 0.35);
      });
    } catch (e) {
      console.log('Audio Context issues: ', e);
    }
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(initialSeconds);
  };

  const setTimerDuration = (secs: number) => {
    setIsActive(false);
    setInitialSeconds(secs);
    setSecondsLeft(secs);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((initialSeconds - secondsLeft) / initialSeconds) * 100;

  return (
    <div 
      id="rest-timer"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden"
    >
      {/* Background visual highlight */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Hypertrophy Rest Timer
          </span>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-slate-500 hover:text-slate-350 transition-colors p-1 rounded-md bg-slate-850"
          title={soundEnabled ? "Mute beep alarm" : "Unmute beep alarm"}
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Timer display */}
        <div className="col-span-7 flex flex-col items-center justify-center bg-slate-850/40 border border-slate-800/60 rounded-xl py-4 relative">
          
          {/* Subtle percentage progress line */}
          <div className="absolute bottom-0 left-0 h-1 bg-indigo-500/80 transition-all duration-300 rounded-b-xl" style={{ width: `${progressPercentage}%` }}></div>

          <span className="text-4xl font-mono font-extrabold tracking-tight text-white select-none">
            {formatTime(secondsLeft)}
          </span>
          
          <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wider mt-1">
            {isActive ? 'RESTING' : 'STANDBY'}
          </span>
        </div>

        {/* Quick controls */}
        <div className="col-span-5 flex flex-col gap-2">
          <button
            onClick={handleStartPause}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              isActive 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20' 
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20'
            }`}
          >
            {isActive ? <Pause size={14} /> : <Play size={14} />}
            {isActive ? 'Pause' : 'Start'}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs text-slate-400 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-705/80 cursor-pointer transition-all"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Preset intervals */}
      <div className="mt-4 flex flex-wrap gap-1.5 justify-between">
        {[60, 90, 120, 180].map((secs) => {
          const minVal = secs / 60;
          const isSelected = initialSeconds === secs;
          return (
            <button
              key={secs}
              onClick={() => setTimerDuration(secs)}
              className={`flex-1 py-1 px-2 text-[10px] font-mono font-medium rounded-md border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 font-bold'
                  : 'bg-slate-800 text-slate-400 border-transparent hover:border-slate-700 hover:bg-slate-700 hover:text-slate-300'
              }`}
            >
              {minVal}m {secs % 60 ? `${secs % 60}s` : ''}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {secondsLeft === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-indigo-500/10 border-2 border-indigo-500/40 rounded-xl flex flex-col items-center justify-center gap-1 backdrop-blur-xs select-none pointer-events-none"
          >
            <Flame className="text-indigo-400 animate-bounce" size={28} />
            <span className="text-sm font-bold text-indigo-400 font-mono">REST PERIOD COMPLETE!</span>
            <span className="text-[10px] text-indigo-500">Tap rest toggle to clear alert</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { Award, Calendar, ChevronRight, Clock, Flame, Trash2, TrendingUp, Dumbbell, Sparkles } from 'lucide-react';
import { WorkoutLog, ProgressionTree } from '../types';
import { motion } from 'motion/react';

interface DashboardProps {
  history: WorkoutLog[];
  trees: ProgressionTree[];
  currentLevels: Record<string, string>;
  onDeleteLog: (id: string) => void;
  onSelectTab: (tab: string) => void;
}

export default function Dashboard({ history, trees, currentLevels, onDeleteLog, onSelectTab }: DashboardProps) {
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);

  // 1. Calculate stats dynamically
  const totalWorkouts = history.length;
  
  // Estimate streak
  const calculateStreak = () => {
    if (history.length === 0) return 0;
    const sortedDates = [...history]
      .map(h => new Date(h.date).getTime())
      .sort((a,b) => b-a); // newest first
    
    let streak = 1;
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Check if newest workout was within 3 days (otherwise streak has died)
    const today = new Date().getTime();
    if (today - sortedDates[0] > 3 * oneDay) {
      return 0; // Streak died
    }

    for (let i = 0; i < sortedDates.length - 1; i++) {
      const diff = sortedDates[i] - sortedDates[i+1];
      if (diff <= oneDay * 1.5) {
        streak++;
      } else if (diff > oneDay * 1.5) {
        break; // Streak broken
      }
    }
    return streak;
  };

  const streakValue = calculateStreak();

  // Find overall maximum level unlocked
  const maxLevelUnlocked = Object.values(currentLevels).reduce((max, val) => {
    const exerciseNode = trees.flatMap(t => t.levels).find(ex => ex.id === val);
    const lvlNum = exerciseNode ? exerciseNode.level : 1;
    return Math.max(max, lvlNum);
  }, 1);

  // Total reps/holds completed across history
  let totalExercisesLogged = 0;
  let totalSetsCompleted = 0;
  history.forEach(log => {
    log.exercisesLogged.forEach(ex => {
      totalExercisesLogged++;
      totalSetsCompleted += ex.sets.length;
    });
  });

  // Plot beautiful custom responsive SVG Area Chart representing Training Volume (Total Reps/Holds logged per workout)
  // Let's create actual custom points from history data
  const chartData = history.slice(-7).map((log) => {
    let workoutVol = 0;
    log.exercisesLogged.forEach(ex => {
      ex.sets.forEach(s => {
        workoutVol += (s.reps || s.holdTime || 0);
      });
    });
    return {
      dateString: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      volume: workoutVol,
      routine: log.routineName || 'Custom session'
    };
  });

  // Svg graph measurements
  const svgWidth = 500;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;

  const maxVolume = Math.max(...chartData.map(d => d.volume), 20); // enforce minimum floor so it scales neatly

  // Calculate coordinates
  const points = chartData.map((d, index) => {
    const x = paddingX + (index / (Math.max(chartData.length - 1, 1))) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (d.volume / maxVolume) * (svgHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // Build the SVG path
  let pathStr = '';
  let areaStr = '';
  if (points.length > 0) {
    pathStr = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathStr += ` L ${points[i].x} ${points[i].y}`;
    }
    
    // Create closed area for gradient fill
    areaStr = `${pathStr} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;
  }

  return (
    <div className="space-y-10">
      
      {/* Metric Cards - Bento Grid style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Streak */}
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden transition-all hover:border-slate-800">
          <div>
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block font-bold">Active Streak</span>
            <div className="flex items-baseline gap-1 mt-1 select-none">
              <span className="text-2xl font-black font-serif text-white">{streakValue}</span>
              <span className="text-[11px] text-slate-450 font-mono">Days</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Flame size={16} className={streakValue > 0 ? "animate-pulse" : ""} />
          </div>
        </div>

        {/* Total Workouts */}
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden transition-all hover:border-slate-800">
          <div>
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block font-bold">Total Sessions</span>
            <div className="flex items-baseline gap-1 mt-1 select-none">
              <span className="text-2xl font-black font-serif text-white">{totalWorkouts}</span>
              <span className="text-[11px] text-slate-450 font-mono">Logged</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-850 border border-slate-800/65 flex items-center justify-center text-slate-405">
            <Dumbbell size={16} />
          </div>
        </div>

        {/* Max Level */}
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden transition-all hover:border-slate-800">
          <div>
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block font-bold">Skill Grade</span>
            <div className="flex items-baseline gap-1 mt-1 select-none">
              <span className="text-2xl font-black font-serif text-white">Lvl {maxLevelUnlocked}</span>
              <span className="text-[11px] text-slate-450 font-mono">Peak</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400">
            <Award size={16} />
          </div>
        </div>

        {/* Total Volume sets */}
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden transition-all hover:border-slate-800">
          <div>
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block font-bold">Work Output</span>
            <div className="flex items-baseline gap-1 mt-1 select-none">
              <span className="text-2xl font-black font-serif text-white">{totalSetsCompleted}</span>
              <span className="text-[11px] text-slate-450 font-mono">Sets</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-850/50 border border-slate-800 flex items-center justify-center text-slate-500">
            <Clock size={16} />
          </div>
        </div>

      </div>

      {/* Main Grid: Active level widgets & Training volume SVG Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Left widget: Progressions levels tracker quickview */}
        <div className="bg-transparent rounded-none lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/40 lg:pr-8 pb-6 lg:pb-0">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={14} className="text-indigo-400" />
              <h3 className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500">Active Milestones</h3>
            </div>
            <h4 className="text-lg font-extrabold font-serif text-white tracking-tight leading-snug mb-3">Core Progressions</h4>
            <p className="text-xs text-slate-455 leading-relaxed mb-6 font-sans">
              Your selected active progression levels across the 5 primary branches.
            </p>

            <div className="space-y-3">
              {trees.map((tree) => {
                const currentId = currentLevels[tree.id];
                const activeLevelNode = tree.levels.find(l => l.id === currentId);
                const activeLevelNum = activeLevelNode ? activeLevelNode.level : 1;
                const activeName = activeLevelNode ? activeLevelNode.name : tree.levels[0].name;
                const progressPercent = (activeLevelNum / tree.levels.length) * 100;

                return (
                  <div key={tree.id} className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/40 transition-all hover:bg-slate-900">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-300 truncate max-w-[130px]">{tree.name.split(' ')[0]} Path</span>
                      <span className="text-[9px] font-mono bg-slate-950 text-slate-450 px-1.5 py-0.5 rounded uppercase font-bold">
                        Lvl {activeLevelNum}/7
                      </span>
                    </div>
                    <div className="text-xs text-indigo-400 font-mono truncate font-medium">
                      {activeName}
                    </div>
                    {/* Tiny visual bar */}
                    <div className="h-1 bg-slate-950 rounded-full mt-2.5 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onSelectTab('progressions')}
            className="w-full flex items-center justify-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-6 pt-4 border-t border-slate-805 font-semibold cursor-pointer"
          >
            Manage Progressions
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Right widget: Custom SVG training volume chart */}
        <div className="bg-slate-900/10 rounded-none lg:col-span-8">
          <div className="flex items-center justify-between mb-3 select-none">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingUp size={14} className="text-indigo-400" />
                <h3 className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500">Vigor Intensity Chart</h3>
              </div>
              <h4 className="text-lg font-extrabold font-serif text-white tracking-tight">Load Progression</h4>
            </div>

            {chartData.length > 0 && hoveredDataPoint !== null && (
              <div className="text-right">
                <span className="text-[9px] text-slate-505 uppercase block font-mono">Volume on {chartData[hoveredDataPoint].dateString}</span>
                <span className="text-xs font-bold font-mono text-indigo-400">{chartData[hoveredDataPoint].volume} Units</span>
              </div>
            )}
          </div>

          {/* SVG Canvas wrapper */}
          <div className="relative w-full h-[210px] flex items-center justify-center">
            {chartData.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-slate-500">No workout sessions logged yet.</p>
                <button
                  onClick={() => onSelectTab('workouts')}
                  className="mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/35 hover:bg-indigo-500/20 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Log First Session
                </button>
              </div>
            ) : (
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Glowing warm amber style area fill */}
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cf8a3c" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#cf8a3c" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = paddingY + ratio * (svgHeight - paddingY * 2);
                  return (
                    <line
                      key={i}
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#22242a"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Filled Area */}
                {areaStr && (
                  <path d={areaStr} fill="url(#areaGrad)" className="transition-all duration-500" />
                )}

                {/* Main Curve Line */}
                {pathStr && (
                  <path
                    d={pathStr}
                    fill="none"
                    stroke="#cf8a3c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500"
                  />
                )}

                {/* Data Nodes */}
                {points.map((pt, index) => (
                  <g key={index}>
                    {/* Hover hotspot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="16"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredDataPoint(index)}
                      onMouseLeave={() => setHoveredDataPoint(null)}
                    />
                    
                    {/* Visual node */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredDataPoint === index ? "5" : "3"}
                      fill={hoveredDataPoint === index ? "#ffffff" : "#cf8a3c"}
                      stroke="#121316"
                      strokeWidth="2.5"
                      className="transition-all duration-150 pointer-events-none"
                    />

                    {/* Simple Date tick labels */}
                    <text
                      x={pt.x}
                      y={svgHeight - 10}
                      fill="#626574"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {pt.dateString}
                    </text>
                  </g>
                ))}
              </svg>
            )}
          </div>
        </div>

      </div>

      {/* Grid: Live Log History - Beautiful, borderless listing */}
      <div className="bg-transparent rounded-none pt-4">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-805">
          <div className="flex items-center gap-1.5 select-none">
            <Calendar size={14} className="text-indigo-400" />
            <h3 className="text-lg font-extrabold font-serif text-white tracking-tight">Workout Session Logs</h3>
          </div>
          <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-450 px-2.5 py-0.5 rounded uppercase font-bold">
            {history.length} Logs Saved
          </span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 select-none">
            <p className="text-xs text-slate-500">Your logged journals will accumulate here.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {[...history].reverse().map((log) => {
              // Format Date elegantly
              const cleanDate = new Date(log.date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div 
                  key={log.id} 
                  className="bg-transparent border-b border-slate-805 pb-4 last:border-b-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-2 flex-1 select-none">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wide">
                        {cleanDate}
                      </span>
                      {log.routineName && (
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded">
                          {log.routineName}
                        </span>
                      )}
                      {log.durationMinutes && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          ⏱ {log.durationMinutes} Mins
                        </span>
                      )}
                    </div>

                    {/* Exercises list summary */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {log.exercisesLogged.map((ex, i) => (
                        <span 
                          key={ex.id} 
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-350 font-medium"
                        >
                          {ex.exerciseName} ({ex.sets.length} sets)
                        </span>
                      ))}
                    </div>

                    {log.notes && (
                      <p className="text-xs text-slate-450 italic mt-1.5 pl-2.5 border-l border-slate-800 leading-relaxed font-sans">
                        "{log.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="cursor-pointer p-2 rounded-lg bg-slate-900 hover:bg-rose-500/5 text-slate-500 hover:text-rose-450 border border-slate-800 hover:border-rose-500/20 transition-all"
                      title="Delete log record"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

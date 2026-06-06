import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Circle, Eye, EyeOff, Award, Sparkles, AlertTriangle } from 'lucide-react';
import { ProgressionTree, Exercise } from '../types';
import { PROGRESSION_TREES } from '../data/progressions';

interface ProgressionsTreeProps {
  currentLevels: Record<string, string>;
  onSelectLevel: (treeId: string, levelId: string) => void;
}

export default function ProgressionsTree({ currentLevels, onSelectLevel }: ProgressionsTreeProps) {
  const [selectedTreeId, setSelectedTreeId] = useState<string>('tree_pull');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const activeTree = PROGRESSION_TREES.find(t => t.id === selectedTreeId) || PROGRESSION_TREES[0];
  const activeUserLevelId = currentLevels[selectedTreeId];

  // Find the user's active level index/number to distinguish locked vs unlocked exercises
  const currentActiveLevelNode = activeTree.levels.find(l => l.id === activeUserLevelId);
  const currentActiveLevelNum = currentActiveLevelNode ? currentActiveLevelNode.level : 1;

  const toggleExpandExercise = (id: string) => {
    if (expandedExerciseId === id) {
      setExpandedExerciseId(null);
    } else {
      setExpandedExerciseId(id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      {/* Path selection sidebar (Vertical tabs) */}
      <div className="lg:col-span-4 space-y-2">
        <span className="text-[10px] font-mono tracking-wider text-slate-505 uppercase block px-1 mb-1 font-bold">
          Calisthenics Domains
        </span>
        {PROGRESSION_TREES.map((tree) => {
          const isSelected = tree.id === selectedTreeId;
          const userLevelId = currentLevels[tree.id];
          const activeNode = tree.levels.find(l => l.id === userLevelId);
          const activeLvlNum = activeNode ? activeNode.level : 1;
          const activeLevelPercent = (activeLvlNum / tree.levels.length) * 100;

          return (
            <button
              key={tree.id}
              onClick={() => {
                setSelectedTreeId(tree.id);
                setExpandedExerciseId(null);
              }}
              className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500/40 text-white shadow-lg'
                  : 'bg-slate-900/30 border-slate-800 text-slate-450 hover:text-slate-200 hover:bg-slate-900/50 hover:border-slate-705'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold tracking-tight uppercase truncate">{tree.name.replace(' Progression', '')}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-850 text-slate-500'
                }`}>
                  Lvl {activeLvlNum}
                </span>
              </div>
              
              <div className="flex items-center justify-between w-full text-[10px] text-slate-500">
                <span className="truncate pr-4">{tree.category} Focus</span>
                <span className="font-mono">{Math.round(activeLevelPercent)}% done</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Focus: Ladder list representing the selected progression path */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        
        {/* Header information on the selected progression */}
        <div className="pb-4 border-b border-slate-800 select-none">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-white tracking-tight">{activeTree.name}</h3>
            <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
              {activeTree.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {activeTree.description}
          </p>
        </div>

        {/* Exercises ladder */}
        <div className="space-y-2.5">
          {activeTree.levels.map((ex) => {
            const isUserActiveLevel = ex.id === activeUserLevelId;
            const isUnlocked = ex.level <= currentActiveLevelNum;
            const isCompleted = ex.level < currentActiveLevelNum;
            const isLocked = ex.level > currentActiveLevelNum;
            const isExpanded = expandedExerciseId === ex.id;

            return (
              <div
                key={ex.id}
                className={`border rounded-xl transition-all overflow-hidden ${
                  isUserActiveLevel
                    ? 'bg-indigo-500/5 border-indigo-500/30'
                    : isCompleted
                    ? 'bg-slate-900/10 border-slate-800 opacity-80 hover:opacity-100 hover:border-slate-700'
                    : 'bg-slate-900/20 border-slate-800/80 opacity-60 hover:opacity-90 hover:border-slate-750'
                }`}
              >
                {/* Collapsed top view */}
                <div 
                  className="p-3.5 flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => toggleExpandExercise(ex.id)}
                >
                  <div className="flex items-center gap-3">
                    
                    {/* Status badge representation */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLevel(activeTree.id, ex.id);
                      }}
                      className="cursor-pointer text-slate-500 transition-colors"
                      title={isUserActiveLevel ? "Your active focus" : `Set as current active focus`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="text-emerald-500 hover:scale-105 transition-transform" size={20} />
                      ) : isUserActiveLevel ? (
                        <Award className="text-amber-400 hover:scale-105 transition-transform animate-pulse" size={20} />
                      ) : (
                        <Circle className="text-slate-600 hover:text-indigo-400" size={20} />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 font-bold">Lvl {ex.level}</span>
                        <h4 className={`text-xs font-bold tracking-tight ${
                          isUserActiveLevel ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-400'
                        }`}>
                          {ex.name}
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Target Volume: {ex.targetValue} {ex.targetMetric === 'reps' ? 'reps' : 'seconds hold'}
                      </span>
                    </div>

                  </div>

                  <div className="flex items-center gap-2">
                    {isUserActiveLevel && (
                      <span className="text-[9px] font-mono font-black uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">
                        Active Target
                      </span>
                    )}
                    {isLocked && (
                      <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        Locked
                      </span>
                    )}
                    <ChevronRight 
                      className={`text-slate-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                      size={14} 
                    />
                  </div>
                </div>

                {/* Expanded metadata detail view */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 bg-slate-950/40 space-y-3">
                    <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
                      {ex.description}
                    </p>

                    <div className="flex items-center justify-between gap-1 flex-wrap pt-2 border-t border-slate-800/50">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500 font-mono">Status Node:</span>
                        <span className={`text-[10px] font-mono font-bold ${
                          isCompleted ? 'text-emerald-400' : isUserActiveLevel ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {isCompleted ? 'Unlocked & Solved' : isUserActiveLevel ? 'Active Growth Quest' : 'Under Investigation'}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectLevel(activeTree.id, ex.id)}
                        className={`text-[10.5px] font-mono px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          isUserActiveLevel
                            ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold'
                            : 'bg-slate-800 hover:bg-slate-705 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {isUserActiveLevel ? '★ Target Selected' : 'Set as Current Milestone'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Milestone advice snippet */}
        <div className="bg-slate-850/30 border border-slate-800/80 p-3.5 rounded-xl flex gap-3 select-none">
          <AlertTriangle className="text-amber-405 shrink-0" size={18} />
          <div>
            <h5 className="text-[11px] font-bold text-amber-300 uppercase font-mono mb-1">
              Safety Guidelines & Progression Criteria
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Before leveling up to the next milestone, ensure you can hit the "Target Volume" with pristine form for at least **3 consecutive workouts**. Never sacrifice joint integrity for rapid level acquisition.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

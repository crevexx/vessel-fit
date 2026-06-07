import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash, Dumbbell, Play, Pause, Save, RotateCcw, Flame, Check, Sparkles, PlusCircle, Clock, ClipboardList } from 'lucide-react';
import { Routine, WorkoutLog, ExerciseLog, WorkoutSet, Category, Exercise } from '../types';
import { PROGRESSION_TREES } from '../data/progressions';

interface WorkoutLoggerProps {
  activeRoutine: Routine | null;
  onAddWorkoutLog: (log: WorkoutLog) => void;
  onClearActiveRoutine: () => void;
}

export default function WorkoutLogger({ activeRoutine, onAddWorkoutLog, onClearActiveRoutine }: WorkoutLoggerProps) {
  // Session logs
  const [exercisesToLog, setExercisesToLog] = useState<ExerciseLog[]>([]);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  
  // Stopwatch states
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const allAvailableExercises = PROGRESSION_TREES.flatMap(tree => tree.levels);

  // Initialize session whenever activeRoutine changes
  useEffect(() => {
    if (activeRoutine) {
      const initialLogs: ExerciseLog[] = activeRoutine.exercises.map((re) => {
        const matchedEx = allAvailableExercises.find(e => e.id === re.exerciseId);
        
        // Populate prefilled default sets
        const sets: WorkoutSet[] = Array.from({ length: re.targetSets }).map((_, i) => ({
          id: `set_${Date.now()}_${re.exerciseId}_${i}`,
          reps: matchedEx?.targetMetric === 'reps' ? matchedEx.targetValue : undefined,
          holdTime: matchedEx?.targetMetric === 'hold' ? matchedEx.targetValue : undefined,
          weight: 0,
          rpe: 8
        }));

        return {
          id: `elog_${Date.now()}_${re.exerciseId}`,
          exerciseId: re.exerciseId,
          exerciseName: matchedEx ? matchedEx.name : 'Unknown Exercise',
          category: matchedEx ? matchedEx.category : 'Pull',
          sets
        };
      });

      setExercisesToLog(initialLogs);
      setElapsedSeconds(0);
      setTimerRunning(true);
    } else {
      // Freeform workout defaults
      setExercisesToLog([]);
      setElapsedSeconds(0);
      setTimerRunning(false);
    }
  }, [activeRoutine]);

  // Stopwatch effect
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const handleStopwatchToggle = () => {
    setTimerRunning(!timerRunning);
  };

  const handleStopwatchReset = () => {
    setTimerRunning(false);
    setElapsedSeconds(0);
  };

  const formatStopwatch = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours > 0 ? `${hours}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add exercise into the active logger pool (for freeform session custom additions)
  const handleAddNewExerciseToLog = (exId: string) => {
    if (!exId) return;
    if (exercisesToLog.some(el => el.exerciseId === exId)) {
      alert('This exercise has already been queued for logging.');
      return;
    }

    const matchedEx = allAvailableExercises.find(e => e.id === exId);
    if (!matchedEx) return;

    const newLog: ExerciseLog = {
      id: `elog_${Date.now()}_${exId}`,
      exerciseId: exId,
      exerciseName: matchedEx.name,
      category: matchedEx.category,
      sets: [
        {
          id: `set_${Date.now()}_0`,
          reps: matchedEx.targetMetric === 'reps' ? matchedEx.targetValue : undefined,
          holdTime: matchedEx.targetMetric === 'hold' ? matchedEx.targetValue : undefined,
          weight: 0,
          rpe: 8
        }
      ]
    };

    setExercisesToLog([...exercisesToLog, newLog]);
    setTimerRunning(true); // Start clock if it wasn't running
  };

  const handleRemoveExerciseFromLog = (elogId: string) => {
    setExercisesToLog(exercisesToLog.filter(el => el.id !== elogId));
  };

  // Set-level modifiers
  const handleAddSet = (elogId: string) => {
    setExercisesToLog(exercisesToLog.map(elog => {
      if (elog.id !== elogId) return elog;

      const matchedEx = allAvailableExercises.find(e => e.id === elog.exerciseId);
      const lastSet = elog.sets[elog.sets.length - 1];

      const newSet: WorkoutSet = {
        id: `set_${Date.now()}_${Math.random()}`,
        reps: lastSet ? lastSet.reps : (matchedEx?.targetMetric === 'reps' ? matchedEx.targetValue : undefined),
        holdTime: lastSet ? lastSet.holdTime : (matchedEx?.targetMetric === 'hold' ? matchedEx.targetValue : undefined),
        weight: lastSet ? lastSet.weight : 0,
        rpe: lastSet ? lastSet.rpe : 8
      };

      return {
        ...elog,
        sets: [...elog.sets, newSet]
      };
    }));
  };

  const handleRemoveSet = (elogId: string, setId: string) => {
    setExercisesToLog(exercisesToLog.map(elog => {
      if (elog.id !== elogId) return elog;
      return {
        ...elog,
        sets: elog.sets.filter(s => s.id !== setId)
      };
    }));
  };

  const handleSetFieldChange = (
    elogId: string, 
    setId: string, 
    field: keyof WorkoutSet, 
    value: number
  ) => {
    setExercisesToLog(exercisesToLog.map(elog => {
      if (elog.id !== elogId) return elog;
      return {
        ...elog,
        sets: elog.sets.map(s => {
          if (s.id !== setId) return s;
          return {
            ...s,
            [field]: value
          };
        })
      };
    }));
  };

  const handleSaveCompletedSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (exercisesToLog.length === 0) {
      alert('Must populate at least 1 exercise before finalizing session.');
      return;
    }

    // Ensure all sets have numerical entries
    const hasInvalidSets = exercisesToLog.some(el => 
      el.sets.length === 0 || el.sets.some(s => (s.reps === undefined && s.holdTime === undefined))
    );

    if (hasInvalidSets) {
      alert('Please fill out sets correctly or delete empty tracks before committing.');
      return;
    }

    const durationMins = Math.max(Math.round(elapsedSeconds / 60), 1);

    const completedLog: WorkoutLog = {
      id: `log_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      routineName: activeRoutine ? activeRoutine.name : 'Freeform Progression Session',
      durationMinutes: durationMins,
      notes: sessionNotes.trim(),
      exercisesLogged: exercisesToLog
    };

    onAddWorkoutLog(completedLog);
    
    // Clear states
    setExercisesToLog([]);
    setSessionNotes('');
    setElapsedSeconds(0);
    setTimerRunning(false);
    onClearActiveRoutine();
    
    alert('Workout Session logged to progression diary successfully!');
  };

  return (
    <div className="space-y-10">
      
      {/* Dynamic top bar with Stopwatch and actions - Slim, borderless header */}
      <div className="border-b border-slate-800/40 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Dumbbell size={18} />
          </div>
          <div>
            <h3 className="text-2xl font-black font-serif text-white tracking-tight">
              {activeRoutine ? activeRoutine.name : 'Freeform Volume Quest'}
            </h3>
            <p className="text-xs text-slate-450 mt-1">
              {activeRoutine ? 'Baseline routine loaded' : 'Choose components to build a customized track'}
            </p>
          </div>
        </div>

        {/* Workout Stopwatch widget */}
        <div className="flex items-center gap-3 self-start md:self-auto select-none">
          <div className="bg-slate-950 border border-slate-800/60 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Clock size={12} className="text-slate-500 font-mono" />
            <span className="text-xs font-mono text-white font-bold inline-block w-[60px] text-center">
              {formatStopwatch(elapsedSeconds)}
            </span>
          </div>

          <button
            onClick={handleStopwatchToggle}
            className={`cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              timerRunning 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
            }`}
          >
            {timerRunning ? <Pause size={12} /> : <Play size={12} />}
            {timerRunning ? 'Pause' : 'Resume'}
          </button>

          <button
            onClick={handleStopwatchReset}
            className="cursor-pointer p-2 rounded-lg bg-slate-955 hover:bg-slate-800 text-slate-500 hover:text-slate-350 border border-slate-850"
            title="Reset stopwatch clock"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        
        {/* Left Side: Exercise Logging Cards - Beautiful, borderless lists with whitespace */}
        <div className="lg:col-span-8 space-y-2">
          {exercisesToLog.length === 0 ? (
            <div className="border border-dashed border-slate-800/80 rounded-2xl p-10 text-center text-slate-400 space-y-4">
              <ClipboardList className="mx-auto text-slate-600" size={28} />
              <div className="max-w-md mx-auto">
                <p className="text-xs text-slate-400 font-medium">Active workout chamber has no objectives yet.</p>
                <p className="text-[11px] text-slate-505 mt-1.5 leading-relaxed">
                  Select a routine from the Routine tab first, or use the panel on the right side of this screen to manually summon calisthenics exercises!
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/40">
              {exercisesToLog.map((elog, elIdx) => {
                const matchedExObj = allAvailableExercises.find(e => e.id === elog.exerciseId);
                const isRepsMetric = matchedExObj?.targetMetric === 'reps';

                return (
                  <div 
                    key={elog.id}
                    className="py-8 first:pt-0 pb-8 space-y-4 transition-all relative"
                  >
                    {/* Exercise label header */}
                    <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-805 select-none">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono text-slate-500 font-bold">#{elIdx+1}</span>
                        <h4 className="text-sm font-bold text-white tracking-wide">{elog.exerciseName}</h4>
                        <span className="text-[9px] font-mono tracking-wider bg-slate-950 border border-slate-800/60 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold">
                          {elog.category}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveExerciseFromLog(elog.id)}
                        className="cursor-pointer text-slate-500 hover:text-rose-400 text-[11px] transition-colors"
                      >
                        Remove Slot
                      </button>
                    </div>

                    {/* Table-like headers for set indices */}
                    <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
                      <div className="space-y-2 min-w-[440px]">
                        <div className="grid grid-cols-12 gap-2 text-[9px] font-mono uppercase text-slate-500 font-bold px-1 select-none">
                          <div className="col-span-2">Set</div>
                          <div className="col-span-4">{isRepsMetric ? 'Reps' : 'Hold (seconds)'}</div>
                          <div className="col-span-3">Add Weight (kg)</div>
                          <div className="col-span-2 text-center">Intensity (RPE)</div>
                          <div className="col-span-1"></div>
                        </div>

                        {/* Log rows */}
                        {elog.sets.map((set, sIdx) => (
                           <div 
                            key={set.id}
                            className="grid grid-cols-12 gap-2 items-center hover:bg-slate-850/10 p-1.5 rounded-lg border border-transparent hover:border-slate-850"
                          >
                            <div className="col-span-2 font-mono text-[11px] text-slate-400 font-bold px-1">
                              Set {sIdx+1}
                            </div>

                            {/* Reps or Hold selector */}
                            <div className="col-span-4">
                              <input
                                type="number"
                                min="0"
                                value={isRepsMetric ? (set.reps ?? '') : (set.holdTime ?? '')}
                                onChange={(e) => handleSetFieldChange(
                                  elog.id, 
                                  set.id, 
                                  isRepsMetric ? 'reps' : 'holdTime', 
                                  parseInt(e.target.value) || 0
                                )}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono text-center focus:outline-none"
                              />
                            </div>

                            {/* Extra Weight */}
                            <div className="col-span-3">
                              <input
                                type="number"
                                min="0"
                                placeholder="0 kg"
                                value={set.weight ?? 0}
                                onChange={(e) => handleSetFieldChange(
                                  elog.id, 
                                  set.id, 
                                  'weight', 
                                  parseFloat(e.target.value) || 0
                                )}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono text-center focus:outline-none"
                              />
                            </div>

                            {/* RPE Rating */}
                            <div className="col-span-2 flex items-center justify-center">
                              <select
                                value={set.rpe ?? 8}
                                onChange={(e) => handleSetFieldChange(
                                  elog.id, 
                                  set.id, 
                                  'rpe', 
                                  parseInt(e.target.value) || 8
                                )}
                                className="bg-slate-950 border border-slate-800 rounded-lg p-1 text-[11px] text-slate-300 font-mono focus:outline-none select-none text-center block w-full"
                                title="Rate of Perceived Exertion (1 to 10 scale)"
                              >
                                {[10, 9.5, 9, 8.5, 8, 7.5, 7, 6].map(num => (
                                  <option key={num} value={num}>
                                    RPE {num}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Delete Set */}
                            <div className="col-span-1 flex justify-center">
                              <button
                                onClick={() => handleRemoveSet(elog.id, set.id)}
                                className="text-slate-650 hover:text-rose-400 p-0.5 rounded transition-colors"
                                title="Delete individual set row"
                              >
                                <Trash size={11} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Table-like bottom triggers */}
                    <div className="flex justify-start">
                      <button
                        onClick={() => handleAddSet(elog.id)}
                        className="cursor-pointer text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-2 py-1 rounded transition-all"
                      >
                        <Plus size={12} /> Add Set
                      </button>
                    </div>

                  </div>
                );
              })}

              {/* Notes input & commit - Clean card */}
              <div className="pt-8 space-y-5">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2 font-bold select-none">
                    Session Reflections & Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Reflect on form, shoulder stability, reps speed, feeling strong..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 placeholder-slate-605 focus:outline-none focus:border-indigo-500/20 resize-none text-left leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (confirm('Erase active workout states completely?')) {
                        setExercisesToLog([]);
                        onClearActiveRoutine();
                        handleStopwatchReset();
                      }
                    }}
                    className="cursor-pointer px-3.5 py-1.5 rounded-lg border border-slate-800/80 text-slate-500 hover:text-rose-400 bg-slate-950/40 hover:bg-rose-950/5 text-xs transition-all font-semibold"
                  >
                    Clear Slate
                  </button>

                  <button
                    onClick={handleSaveCompletedSession}
                    className="cursor-pointer py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs tracking-tight transition-all flex items-center gap-1.5 shadow-md shadow-indigo-650/5 text-white-force"
                  >
                    <Save size={14} /> Commit Completed Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Quick Add Exercises / Routine details - Beautiful container */}
        <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/60 rounded-2xl p-5 h-fit space-y-4">
          <div className="pb-3 border-b border-slate-850 select-none">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Exercise Summoner</h4>
            <p className="text-[11px] text-slate-450 leading-relaxed mt-1">
              Assemble a freeform session by pulling custom progressions directly into your log checklist.
            </p>
          </div>

          <div className="space-y-4">
            {/* Summon from list */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono uppercase text-slate-500 block font-bold">Choose progression target:</span>
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {PROGRESSION_TREES.map((tree) => {
                  return (
                    <div key={tree.id} className="p-2 space-y-1 bg-slate-950/60 rounded-xl border border-slate-850">
                      <span className="text-[9px] font-mono uppercase text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 block w-fit font-bold mb-1.5">
                        {tree.name.replace(' Progression', '')}
                      </span>
                      {tree.levels.map(ex => {
                        const isLogged = exercisesToLog.some(el => el.exerciseId === ex.id);

                        return (
                          <button
                            key={ex.id}
                            onClick={() => handleAddNewExerciseToLog(ex.id)}
                            disabled={isLogged}
                            className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-between ${
                              isLogged
                                ? 'bg-slate-900/10 text-slate-650 cursor-not-allowed'
                                : 'bg-slate-900/60 hover:bg-slate-850/80 text-slate-350 border border-slate-850 hover:border-slate-800'
                            }`}
                          >
                            <span>Lvl {ex.level} | {ex.name}</span>
                            {isLogged ? (
                              <Check size={11} className="text-indigo-400 shrink-0" />
                            ) : (
                              <PlusCircle size={10} className="text-slate-500 hover:text-indigo-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Trash, Dumbbell, Play, ClipboardList, Sparkles, FolderPlus, ArrowRight } from 'lucide-react';
import { Routine, Category, RoutineExercise } from '../types';
import { PROGRESSION_TREES } from '../data/progressions';

interface RoutinesBuilderProps {
  customRoutines: Routine[];
  allRoutines: Routine[]; // default + custom combined
  onCreateRoutine: (routine: Routine) => void;
  onDeleteRoutine: (id: string) => void;
  onStartRoutine: (routine: Routine) => void;
}

export default function RoutinesBuilder({ 
  customRoutines, 
  allRoutines, 
  onCreateRoutine, 
  onDeleteRoutine, 
  onStartRoutine 
}: RoutinesBuilderProps) {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newRoutineName, setNewRoutineName] = useState<string>('');
  const [newRoutineDesc, setNewRoutineDesc] = useState<string>('');
  const [newRoutineCategory, setNewRoutineCategory] = useState<Category>('Pull');
  const [addedExercises, setAddedExercises] = useState<RoutineExercise[]>([]);
  
  // State for temporary add-exercise controls
  const [selectExerciseId, setSelectExerciseId] = useState<string>('');
  const [selectSets, setSelectSets] = useState<number>(3);
  const [selectReps, setSelectReps] = useState<string>('8-12 reps');

  const allAvailableExercises = PROGRESSION_TREES.flatMap(tree => tree.levels);

  const resetForm = () => {
    setNewRoutineName('');
    setNewRoutineDesc('');
    setNewRoutineCategory('Pull');
    setAddedExercises([]);
    setIsCreating(false);
  };

  const handleAddExerciseToTempList = () => {
    if (!selectExerciseId) return;
    
    // Check if already exists in routine
    if (addedExercises.some(ex => ex.exerciseId === selectExerciseId)) {
      alert('This exercise occupies a slot already.');
      return;
    }

    setAddedExercises([
      ...addedExercises,
      {
        exerciseId: selectExerciseId,
        targetSets: selectSets,
        targetRepsOrTime: selectReps
      }
    ]);
    
    // Reset temporary selection selectors
    setSelectExerciseId('');
  };

  const handleRemoveTempExercise = (exId: string) => {
    setAddedExercises(addedExercises.filter(ex => ex.exerciseId !== exId));
  };

  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineName.trim()) {
      alert('A routine name description is required.');
      return;
    }
    if (addedExercises.length === 0) {
      alert('Configure at least 1 exercise target slot before saving.');
      return;
    }

    const newRoutine: Routine = {
      id: `custom_r_${Date.now()}`,
      name: newRoutineName.trim(),
      description: newRoutineDesc.trim() || 'Custom athletic calisthenics routine',
      category: newRoutineCategory,
      exercises: addedExercises
    };

    onCreateRoutine(newRoutine);
    resetForm();
  };

  return (
    <div className="space-y-6">
      
      {/* Header action panel */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Structured Routine Planner</h2>
          <p className="text-xs text-slate-400">Design custom combinations or launch optimized baseline workouts.</p>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 text-xs font-semibold cursor-pointer transition-all"
          >
            <FolderPlus size={14} />
            Build Custom Routine
          </button>
        )}
      </div>

      {/* Routine Creator Form Modal/Drawer block */}
      {isCreating && (
        <form 
          onSubmit={handleSaveRoutine}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="text-indigo-400" size={16} />
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Custom Routine Architect</h3>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Meta input parameters */}
            <div className="md:col-span-4 space-y-3.5">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Routine Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Iron Chest & Upper Pull"
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Primary Vector Focus
                </label>
                <select
                  value={newRoutineCategory}
                  onChange={(e) => setNewRoutineCategory(e.target.value as Category)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Pull">Vertical & Horizontal Pull</option>
                  <option value="Push">Vertical & Horizontal Push</option>
                  <option value="Legs">Unilateral Leg & Quad power</option>
                  <option value="Core">Front Lever & Lever Core</option>
                  <option value="Skills">Freestanding Skill Balance</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Brief description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Focus on chest-to-bar height pullups followed by core l-sit compression drills"
                  value={newRoutineDesc}
                  onChange={(e) => setNewRoutineDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none"
                />
              </div>
            </div>

            {/* Exercise aggregator */}
            <div className="md:col-span-8 bg-slate-900/10 border border-slate-800/80 rounded-xl p-4 space-y-4">
              
              {/* Internal selection controls row */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block font-bold">Add Exercises</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <select
                      value={selectExerciseId}
                      onChange={(e) => setSelectExerciseId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-md p-1.5 text-[11px] text-white focus:outline-none"
                    >
                      <option value="">-- Choose Exercise --</option>
                      {allAvailableExercises.map(ex => (
                        <option key={ex.id} value={ex.id}>
                          Lvl {ex.level} | {ex.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <div className="w-16">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        title="Sets"
                        placeholder="Sets"
                        value={selectSets}
                        onChange={(e) => setSelectSets(parseInt(e.target.value) || 3)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-md p-1.5 text-[11px] text-white text-center focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Reps (e.g. 8-12 reps, 15s hold)"
                        value={selectReps}
                        onChange={(e) => setSelectReps(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-md p-1.5 text-[11px] text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddExerciseToTempList}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-slate-705 text-white rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 border border-slate-700"
                  >
                    <Plus size={12} /> Add Exercise
                  </button>
                </div>
              </div>

              {/* Added exercises visual feedback */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">Exercises Currently in Routine ({addedExercises.length})</span>
                
                {addedExercises.length === 0 ? (
                  <p className="text-[11px] text-slate-505 italic py-2">No exercises added yet. Use the select box above.</p>
                ) : (
                  <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                    {addedExercises.map((ae, index) => {
                      const matchedEx = allAvailableExercises.find(e => e.id === ae.exerciseId);
                      return (
                        <div key={ae.exerciseId} className="flex items-center justify-between bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500">#{index+1}</span>
                            <span className="text-[11px] font-bold text-white font-mono">{matchedEx?.name}</span>
                            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 font-mono">
                              {ae.targetSets} sets x {ae.targetRepsOrTime}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveTempExercise(ae.exerciseId)}
                            className="text-slate-500 hover:text-rose-450 transition-colors p-1"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <button
              type="submit"
              className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-indigo-600/10"
            >
              <ClipboardList size={14} /> Commit Routine
            </button>
          </div>
        </form>
      )}

      {/* Grid listing all default and custom routines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allRoutines.map((routine) => {
          const isCustom = routine.id.startsWith('custom_r_');
          
          return (
            <div 
              key={routine.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-705 rounded-2xl p-5 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4 select-none">
                  <span className="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-bold">
                    {routine.category} Focus
                  </span>
                  {isCustom ? (
                    <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-bold">
                      Custom
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono uppercase bg-slate-850 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-bold">
                      Baseline
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight">{routine.name}</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1 mb-4 italic">
                  "{routine.description}"
                </p>

                {/* List of constituent exercises */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">Exercise Lineup</h4>
                  {routine.exercises.map((re) => {
                    const matchedEx = allAvailableExercises.find(e => e.id === re.exerciseId);
                    return (
                      <div key={re.exerciseId} className="flex items-center justify-between bg-slate-850/40 border border-slate-800/60 px-2.5 py-1.5 rounded-lg">
                        <span className="text-[11px] text-slate-350 truncate max-w-[170px] font-medium">{matchedEx ? matchedEx.name : 'Unknown exercise'}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-medium">{re.targetSets}s x {re.targetRepsOrTime}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-800">
                {isCustom ? (
                  <button
                    onClick={() => onDeleteRoutine(routine.id)}
                    className="cursor-pointer text-xs text-slate-500 hover:text-rose-450 transition-colors py-1 px-2 hover:bg-rose-950/10 rounded"
                    title="Delete custom routine plan"
                  >
                    Delete Routine
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={() => onStartRoutine(routine)}
                  className="cursor-pointer flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white text-xs font-bold transition-all shadow-md active:scale-95 rounded-xl"
                >
                  <Play size={12} fill="white" /> Engage Routine
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

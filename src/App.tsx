import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  Settings, 
  RefreshCw, 
  HelpCircle, 
  Dumbbell, 
  Flame, 
  Sparkles,
  ClipboardList,
  Heart,
  Sun,
  Moon,
  Share2
} from 'lucide-react';
import { Category, WorkoutLog, Routine, UserProgressState } from './types';
import { DEFAULT_ROUTINES, PROGRESSION_TREES, PRELOADED_LOGS } from './data/progressions';
import AdPlaceholder from './components/AdPlaceholder';
import RestTimer from './components/RestTimer';
import Dashboard from './components/Dashboard';
import ProgressionsTree from './components/ProgressionsTree';
import RoutinesBuilder from './components/RoutinesBuilder';
import WorkoutLogger from './components/WorkoutLogger';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('cali_theme') as 'light' | 'dark') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      if (theme === 'light') {
        root.classList.add('light');
      } else {
        root.classList.remove('light');
      }
      localStorage.setItem('cali_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleShare = async () => {
    const shareData = {
      title: 'Vessel — Calisthenics Progress Planner',
      text: 'Plan, track, and unlock your calisthenics progressions with Vessel!',
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setToast('Link copied to clipboard!');
    } catch (err) {
      setToast('Failed to copy link.');
    }
  };
  
  // App States
  const [currentLevels, setCurrentLevels] = useState<Record<string, string>>({
    tree_pull: 'pull_1',
    tree_push: 'push_1',
    tree_vpush: 'vpush_1',
    tree_core: 'core_1',
    tree_legs: 'legs_1',
  });
  const [history, setHistory] = useState<WorkoutLog[]>([]);
  const [customRoutines, setCustomRoutines] = useState<Routine[]>([]);
  const [activeWorkoutRoutine, setActiveWorkoutRoutine] = useState<Routine | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Force-reset once to clear any old seeds/testing states for the user's fresh view
      const hasInitializedFresh = localStorage.getItem('cali_initialized_fresh_v3');
      if (!hasInitializedFresh) {
        localStorage.removeItem('cali_current_levels');
        localStorage.removeItem('cali_history');
        localStorage.removeItem('cali_custom_routines');
        localStorage.setItem('cali_initialized_fresh_v3', 'true');
        
        // State matches clean first-timer setup
        setCurrentLevels({
          tree_pull: 'pull_1',
          tree_push: 'push_1',
          tree_vpush: 'vpush_1',
          tree_core: 'core_1',
          tree_legs: 'legs_1',
        });
        setHistory([]);
        setCustomRoutines([]);
        return;
      }

      const savedLevels = localStorage.getItem('cali_current_levels');
      const savedHistory = localStorage.getItem('cali_history');
      const savedCustomRoutines = localStorage.getItem('cali_custom_routines');

      if (savedLevels) setCurrentLevels(JSON.parse(savedLevels));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedCustomRoutines) setCustomRoutines(JSON.parse(savedCustomRoutines));
    } catch (e) {
      console.error('Failed to load from localized local storage', e);
    }
  }, []);

  // Save changes triggers
  const saveLevelsToStore = (levels: Record<string, string>) => {
    setCurrentLevels(levels);
    localStorage.setItem('cali_current_levels', JSON.stringify(levels));
  };

  const saveHistoryToStore = (newHistory: WorkoutLog[]) => {
    setHistory(newHistory);
    localStorage.setItem('cali_history', JSON.stringify(newHistory));
  };

  const saveCustomRoutinesToStore = (newRoutines: Routine[]) => {
    setCustomRoutines(newRoutines);
    localStorage.setItem('cali_custom_routines', JSON.stringify(newRoutines));
  };

  // State callbacks
  const handleSelectLevel = (treeId: string, exerciseId: string) => {
    const updated = { ...currentLevels, [treeId]: exerciseId };
    saveLevelsToStore(updated);
  };

  const handleAddWorkoutLog = (completedLog: WorkoutLog) => {
    const updated = [...history, completedLog];
    saveHistoryToStore(updated);
    setActiveTab('dashboard'); // take user back to metrics
  };

  const handleDeleteWorkoutLog = (logId: string) => {
    if (confirm('Permanently remove this workout record from your log history?')) {
      const updated = history.filter(log => log.id !== logId);
      saveHistoryToStore(updated);
    }
  };

  const handleCreateRoutine = (newRoutine: Routine) => {
    const updated = [...customRoutines, newRoutine];
    saveCustomRoutinesToStore(updated);
  };

  const handleDeleteRoutine = (routineId: string) => {
    if (confirm('Are you sure you want to delete this routine template?')) {
      const updated = customRoutines.filter(r => r.id !== routineId);
      saveCustomRoutinesToStore(updated);
    }
  };

  const handleStartRoutine = (routine: Routine) => {
    setActiveWorkoutRoutine(routine);
    setActiveTab('workouts'); // kick user directly to log screen
  };

  const handleResetToSeeds = () => {
    if (confirm('Reset application to default seed data? All custom progression states and logs will be restored to defaults.')) {
      localStorage.removeItem('cali_current_levels');
      localStorage.removeItem('cali_history');
      localStorage.removeItem('cali_custom_routines');

      setCurrentLevels({
        tree_pull: 'pull_4',
        tree_push: 'push_4',
        tree_vpush: 'vpush_4',
        tree_core: 'core_3',
        tree_legs: 'legs_3',
      });
      setHistory(PRELOADED_LOGS);
      setCustomRoutines([]);
      setActiveWorkoutRoutine(null);
      setActiveTab('dashboard');
      
      alert('Application restored to factory presets!');
    }
  };

  const handleClearAllData = () => {
    if (confirm('Wipe ALL application databases? This action cannot be undone.')) {
      saveLevelsToStore({
        tree_pull: 'pull_1',
        tree_push: 'push_1',
        tree_vpush: 'vpush_1',
        tree_core: 'core_1',
        tree_legs: 'legs_1',
      });
      saveHistoryToStore([]);
      saveCustomRoutinesToStore([]);
      setActiveWorkoutRoutine(null);
      setActiveTab('dashboard');
      
      alert('Local database completely cleared.');
    }
  };

  // Combine Default and Custom Routines
  const combinedRoutines = [...DEFAULT_ROUTINES, ...customRoutines];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased overflow-x-hidden relative">
      
      {/* Decorative radial gradients for high-end aesthetics */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-slate-800/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-slate-800/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Top Banner Content (Full width restriction center) */}
      <header className="w-full max-w-7xl mx-auto px-4 pt-4 shrink-0">
        <AdPlaceholder type="banner" />
      </header>

      {/* Premium Navigation Header bar */}
      <nav id="app-nav" className="w-full max-w-7xl mx-auto px-4 py-4 shrink-0">
        <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center justify-between flex-wrap gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Dumbbell size={18} className="text-white font-black animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-white font-sans">
                  Vessel
                </h1>
                <p className="text-[10px] font-mono tracking-wider text-indigo-400 uppercase">
                  Calisthenics Planner
                </p>
              </div>
            </div>

            <button
              id="theme-mode-toggle"
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="cursor-pointer p-1.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/80 text-indigo-400 hover:text-indigo-300 transition-all flex items-center justify-center shadow-inner"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle Theme Mode"
            >
              {theme === 'light' ? (
                <Moon size={13} className="animate-pulse" />
              ) : (
                <Sun size={13} className="animate-spin-slow" />
              )}
            </button>

            <button
              id="share-app-button"
              onClick={handleShare}
              className="cursor-pointer p-1.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/80 text-indigo-400 hover:text-indigo-300 transition-all flex items-center justify-center shadow-inner"
              title="Share Vessel"
              aria-label="Share Application"
            >
              <Share2 size={13} />
            </button>
          </div>

          {/* Tab selectors */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/60">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'progressions', label: 'Progress Tree', icon: Award },
              { id: 'routines', label: 'Routine Planner', icon: ClipboardList },
              { id: 'workouts', label: 'Chamber Log', icon: Dumbbell }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected 
                      ? 'bg-slate-900 text-white font-bold border border-slate-800' 
                      : 'text-slate-400 hover:text-slate-250 hover:bg-slate-900/50'
                  }`}
                >
                  <TabIcon size={13} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase">
              ● Sandbox Local Storage active
            </span>
          </div>

        </div>
      </nav>

      {/* Main Structural split Content Frame */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column - Content pane */}
        <section className="lg:col-span-8 flex flex-col justify-start">
          <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 md:p-6 relative overflow-hidden backdrop-blur-xs min-h-[500px]">
            {activeTab === 'dashboard' && (
              <Dashboard 
                history={history} 
                trees={PROGRESSION_TREES} 
                currentLevels={currentLevels} 
                onDeleteLog={handleDeleteWorkoutLog}
                onSelectTab={setActiveTab}
              />
            )}

            {activeTab === 'progressions' && (
              <ProgressionsTree 
                currentLevels={currentLevels} 
                onSelectLevel={handleSelectLevel}
              />
            )}

            {activeTab === 'routines' && (
              <RoutinesBuilder 
                customRoutines={customRoutines}
                allRoutines={combinedRoutines}
                onCreateRoutine={handleCreateRoutine}
                onDeleteRoutine={handleDeleteRoutine}
                onStartRoutine={handleStartRoutine}
              />
            )}

            {activeTab === 'workouts' && (
              <WorkoutLogger 
                activeRoutine={activeWorkoutRoutine}
                onAddWorkoutLog={handleAddWorkoutLog}
                onClearActiveRoutine={() => setActiveWorkoutRoutine(null)}
              />
            )}
          </div>
        </section>

        {/* Right column - Sidebar */}
        <aside className="lg:col-span-4 space-y-6 flex flex-col justify-between h-fit lg:h-auto min-h-full">
          
          <div className="space-y-6 flex-1">
            {/* Rest Timer section */}
            <RestTimer />

            {/* General Utilities & Diagnostics Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="pb-3 border-b border-slate-800 select-none">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-0.5">
                  SANDBOX CONFIGS
                </span>
                <h4 className="text-xs font-bold text-white tracking-tight">Database Management</h4>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleResetToSeeds}
                  className="cursor-pointer py-2 px-3 bg-slate-800 hover:bg-slate-705 hover:text-white text-slate-400 border border-slate-700 transition-all text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={12} />
                  Restore Seeds
                </button>

                <button
                  onClick={handleClearAllData}
                  className="cursor-pointer py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-450 transition-all text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                >
                  Clear Data
                </button>
              </div>

              <div className="p-3 bg-slate-800/20 border border-slate-800/45 rounded-lg text-[11px] text-slate-500 select-none">
                This progress planner operates completely local to this browser session. Absolutely zero accounts, user setups, or sign-ins required.
              </div>
            </div>
          </div>

          {/* Ad Placement Sidebar (always on bottom of right sidebar or fills lower height space) */}
          <div className="mt-auto lg:pt-6 h-full flex flex-col">
            <AdPlaceholder type="sidebar" />
          </div>

        </aside>

      </main>

      {/* Styled Footer */}
      <footer className="w-full py-6 bg-slate-950 border-t border-slate-900 text-center shrink-0">
         <div className="w-full max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>Vessel &copy; 2026. All progressions tuned.</p>
          <p className="flex items-center gap-1">
            Built with supreme devotion <Heart size={10} className="text-rose-500 fill-rose-500" /> for elite athletic optimization
          </p>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 backdrop-blur-md px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-mono text-indigo-400 select-none animate-bounce">
          <Sparkles size={14} className="text-indigo-400 animate-pulse" />
          <span className="font-sans font-semibold">{toast}</span>
        </div>
      )}

    </div>
  );
}

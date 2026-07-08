import React, { useState, useEffect, useRef } from 'react';
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
  Share2,
  Menu,
  X,
  Download,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExportData = () => {
    try {
      const exportPayload = {
        app: 'vessel',
        version: 3,
        exportedAt: new Date().toISOString(),
        data: {
          currentLevels,
          history,
          customRoutines,
        },
      };
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `vessel-backup-${dateStamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToast('Progress exported to file!');
    } catch (e) {
      console.error('Failed to export data', e);
      setToast('Export failed — see console.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so re-selecting the same file still triggers onChange
    e.target.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const incoming = parsed?.data ?? parsed; // accept raw or wrapped exports

        const validLevels = incoming?.currentLevels && typeof incoming.currentLevels === 'object';
        const validHistory = Array.isArray(incoming?.history);
        const validRoutines = Array.isArray(incoming?.customRoutines);

        if (!validLevels || !validHistory || !validRoutines) {
          setToast('Import failed — not a valid Vessel backup file.');
          return;
        }

        if (!confirm('Import this backup? It will overwrite your current progress, logs, and routines.')) {
          return;
        }

        saveLevelsToStore(incoming.currentLevels);
        saveHistoryToStore(incoming.history);
        saveCustomRoutinesToStore(incoming.customRoutines);
        setActiveWorkoutRoutine(null);
        setToast('Progress imported successfully!');
      } catch (err) {
        console.error('Failed to import data', err);
        setToast('Import failed — file is not valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Combine Default and Custom Routines
  const combinedRoutines = [...DEFAULT_ROUTINES, ...customRoutines];

  // Simple streak calculator for the sidebar User Profile
  const getProfileStreak = () => {
    if (history.length === 0) return 0;
    const sortedDates = [...history]
      .map(h => new Date(h.date).getTime())
      .sort((a,b) => b-a);
    
    let streak = 1;
    const oneDay = 24 * 60 * 60 * 1000;
    
    const today = new Date().getTime();
    if (today - sortedDates[0] > 3 * oneDay) {
      return 0;
    }

    for (let i = 0; i < sortedDates.length - 1; i++) {
      const diff = sortedDates[i] - sortedDates[i+1];
      if (diff <= oneDay * 1.5) {
        streak++;
      } else if (diff > oneDay * 1.5) {
        break;
      }
    }
    return streak;
  };

  const currentStreak = getProfileStreak();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased overflow-x-hidden relative">
      
      {/* Decorative subtle ambient glows for high-end aesthetics */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Top Banner Content (Full width restriction center) */}
      <header className="w-full max-w-7xl mx-auto px-4 pt-4 shrink-0">
        <AdPlaceholder type="banner" />
      </header>

      {/* Premium Minimal Navigation Header bar */}
      <nav id="app-nav" className="w-full max-w-7xl mx-auto px-4 py-4 shrink-0">
        <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-md px-5 py-3.5 rounded-2xl flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Dumbbell size={16} className="text-white font-black" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-white font-sans">
                Vessel
              </h1>
              <p className="text-[9px] font-mono tracking-wider text-indigo-400 uppercase">
                Indie Athlete Engine
              </p>
            </div>
          </div>

          {/* Tab selectors */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800/40">
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
                  className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected 
                      ? 'bg-slate-900 text-white font-bold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                  }`}
                >
                  <TabIcon size={12} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sliding Hamburger Sidebar Trigger Button in the corner */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="cursor-pointer p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-indigo-400 hover:text-indigo-300 transition-all flex items-center justify-center shadow-sm"
              title="Open console sidebar menu"
              aria-label="Open Sidebar Menu"
            >
              <Menu size={16} />
            </button>
          </div>

        </div>
      </nav>

      {/* Main Structural split Content Frame - Extremely clean & spacious */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column - Content pane */}
        <section className="lg:col-span-8 flex flex-col justify-start">
          <div className="flex-1 bg-slate-900/40 rounded-2xl p-4 md:p-8 relative overflow-hidden backdrop-blur-xs min-h-[500px]">
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

        {/* Right column - Sidebar (Clean, generous spacing, rest timer only) */}
        <aside className="lg:col-span-4 space-y-8 flex flex-col justify-between h-fit lg:h-auto min-h-full">
          
          <div className="space-y-8 flex-1">
            {/* Rest Timer section */}
            <RestTimer />
          </div>

          {/* Ad Placement Sidebar */}
          <div className="mt-auto lg:pt-8 h-full flex flex-col">
            <AdPlaceholder type="sidebar" />
          </div>

        </aside>

      </main>

      {/* Sliding Sidebar Menu (≡) Drawer using motion and AnimatePresence */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Cabinet Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-slate-900 border-l border-slate-800/80 p-6 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-8">
                {/* Drawer Title & Close Trigger */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-sm font-extrabold tracking-tight text-white uppercase font-mono">Console Center</h2>
                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Independent Workspace Settings</p>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="cursor-pointer p-1.5 rounded-lg bg-slate-850 hover:bg-slate-805 text-slate-400 hover:text-white border border-slate-800"
                    aria-label="Close sidebar panel"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Hand-CRAFTED User Profile Card Options */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-extrabold text-sm font-mono shadow-inner select-none">
                      DE
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-2 py-0.5 rounded uppercase font-bold">
                        Verified Athlete
                      </span>
                      <h3 className="text-xs font-bold text-white tracking-wide truncate mt-1">
                        devilsde221@gmail.com
                      </h3>
                    </div>
                  </div>

                  {/* Profile stats preview */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/50">
                    <div className="bg-slate-900/30 p-2 rounded-lg border border-slate-800/40 text-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Active Streak</span>
                      <span className="text-xs font-bold font-mono text-white mt-0.5 inline-block">
                        {currentStreak} Days
                      </span>
                    </div>
                    <div className="bg-slate-900/30 p-2 rounded-lg border border-slate-800/40 text-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Total Logs</span>
                      <span className="text-xs font-bold font-mono text-white mt-0.5 inline-block">
                        {history.length} Saved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Theme mode toggle option */}
                <div className="space-y-2 select-none">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                    Aesthetics preference
                  </span>
                  <button
                    onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                    className="w-full cursor-pointer flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-705 transition-all text-xs font-semibold text-slate-300"
                  >
                    <span className="flex items-center gap-2">
                      {theme === 'light' ? <Moon size={14} className="text-indigo-400" /> : <Sun size={14} className="text-amber-500" />}
                      {theme === 'light' ? 'Switch to Dark Mood' : 'Switch to Soft Paper light'}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest pl-1">
                      {theme === 'light' ? 'Light ACTIVE' : 'Dark ACTIVE'}
                    </span>
                  </button>
                </div>

                {/* Share options */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                    Community Integration
                  </span>
                  <button
                    onClick={() => {
                      handleShare();
                      setIsSidebarOpen(false);
                    }}
                    className="w-full cursor-pointer flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-indigo-600 hover:text-white transition-all text-xs font-semibold text-slate-300"
                  >
                    <Share2 size={14} className="text-indigo-400" />
                    <span>Share Vessel Platform URL</span>
                  </button>
                </div>

                {/* Advanced Database Sandbox Settings Option */}
                <div className="space-y-3">
                  <div className="pb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                      Data Storage Console
                    </span>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                      This system runs entirely on sandbox client localStorage. Toggle factory states below.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleExportData}
                      className="cursor-pointer py-2 px-3 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Download size={11} />
                      Export Data
                    </button>

                    <button
                      onClick={handleImportClick}
                      className="cursor-pointer py-2 px-3 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Upload size={11} />
                      Import Data
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        handleResetToSeeds();
                        setIsSidebarOpen(false);
                      }}
                      className="cursor-pointer py-2 px-3 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw size={11} />
                      Restore Seeds
                    </button>

                    <button
                      onClick={() => {
                        handleClearAllData();
                        setIsSidebarOpen(false);
                      }}
                      className="cursor-pointer py-2 px-3 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 border border-rose-500/10 hover:border-rose-550 transition-all text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      Clear Database
                    </button>
                  </div>
                </div>

              </div>

              {/* Version & Credit */}
              <div className="pt-6 border-t border-slate-800 text-center select-none text-[10px] text-slate-500 font-mono">
                VESSEL INDIE WORKSPACE v3.1
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
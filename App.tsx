
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  LayoutGrid, 
  Loader2, 
  Flame, 
  Trophy, 
  BookOpen, 
  History,
  LogOut,
  User as UserIcon,
  BarChart3,
  CheckCircle,
  PlusCircle,
  Clock,
  Shuffle,
  // Fix: Added missing ChevronRight icon import to resolve "Cannot find name 'ChevronRight'" errors
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Word, Difficulty, QuizQuestion, UserProgress, User } from './types';
import * as gemini from './services/geminiService';
import Navigation from './components/Navigation';
import WordCard from './components/WordCard';
import Quiz from './components/Quiz';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(true);
  const [dailyWord, setDailyWord] = useState<Word | null>(null);
  const [savedWords, setSavedWords] = useState<Word[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.INTERMEDIATE);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quote, setQuote] = useState("");
  const [progress, setProgress] = useState<UserProgress>({
    learnedCount: 0,
    streak: 3,
    lastActive: new Date().toISOString(),
    history: [
      { date: 'Mon', count: 5 },
      { date: 'Tue', count: 8 },
      { date: 'Wed', count: 4 },
      { date: 'Thu', count: 12 },
      { date: 'Fri', count: 7 },
      { date: 'Sat', count: 10 },
      { date: 'Sun', count: 0 },
    ]
  });

  // Load persistence
  useEffect(() => {
    const saved = localStorage.getItem('saved_words');
    if (saved) setSavedWords(JSON.parse(saved));

    const prog = localStorage.getItem('user_progress');
    if (prog) setProgress(JSON.parse(prog));

    const fetchInitialData = async () => {
      const q = await gemini.getMotivationalQuote();
      setQuote(q);
      const dw = await gemini.generateWord(Difficulty.RANDOM);
      setDailyWord(dw);
    };
    fetchInitialData();
  }, []);

  const handleSaveWord = useCallback((word: Word) => {
    setSavedWords(prev => {
      const exists = prev.find(w => w.term === word.term);
      const updated = exists ? prev.filter(w => w.term !== word.term) : [word, ...prev];
      localStorage.setItem('saved_words', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const generateNewWord = async () => {
    setIsLoading(true);
    try {
      const word = await gemini.generateWord(difficulty);
      setDailyWord(word);
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = async () => {
    setIsLoading(true);
    setQuizScore(null);
    try {
      const baseWords = savedWords.length > 3 ? savedWords.slice(0, 5) : [dailyWord!];
      const questions = await gemini.generateQuiz(baseWords);
      setQuizQuestions(questions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setProgress(prev => ({
      ...prev,
      learnedCount: prev.learnedCount + score,
    }));
  };

  if (showAuth && !user) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md space-y-8 animate-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">VocabWithFaisal</h1>
            <p className="text-indigo-100 opacity-80 font-medium">Elevate your vocabulary journey</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl space-y-6">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-60">Email</label>
                <input type="email" placeholder="faisal@example.com" className="w-full bg-white/10 border-white/20 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-white/50 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-60">Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/10 border-white/20 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-white/50 transition-all" />
              </div>
              <button 
                onClick={() => setUser({ name: 'Faisal', email: 'f@f.com', isLoggedIn: true })}
                className="w-full bg-white text-indigo-600 font-bold py-4 rounded-xl hover:bg-indigo-50 transition-colors shadow-xl shadow-indigo-900/40"
              >
                Start Learning
              </button>
            </div>
            <div className="flex justify-between text-xs font-medium text-indigo-100">
              <button>Forgot Password?</button>
              <button>Create Account</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-50 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">VocabWithFaisal</h1>
            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-widest">
              <Flame size={12} fill="currentColor" /> {progress.streak} Day Streak
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
            <Bell size={20} />
          </button>
          <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
            F
          </div>
        </div>
      </header>

      <main className="px-6 py-6 max-w-2xl mx-auto space-y-8">
        {currentTab === 'dashboard' && (
          <>
            {/* Motivational Quote */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Quote of the Day</span>
                <p className="text-xl font-medium leading-relaxed italic">"{quote || 'Focus on your growth.'}"</p>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <BookOpen size={140} />
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{progress.learnedCount}</p>
                  <p className="text-xs font-medium text-slate-400">Words Learned</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{savedWords.length}</p>
                  <p className="text-xs font-medium text-slate-400">Saved List</p>
                </div>
              </div>
            </div>

            {/* Today's Word */}
            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="text-xl font-bold text-slate-800">Today's Highlight</h3>
                <button onClick={() => setCurrentTab('generator')} className="text-sm font-bold text-indigo-600">See More</button>
              </div>
              {dailyWord ? (
                <WordCard 
                  word={dailyWord} 
                  isSaved={savedWords.some(w => w.term === dailyWord.term)} 
                  onToggleSave={handleSaveWord} 
                />
              ) : (
                <div className="h-48 bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center">
                  <Loader2 className="animate-spin text-slate-300" />
                </div>
              )}
            </section>
          </>
        )}

        {currentTab === 'generator' && (
          <section className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Learn New Words</h2>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {Object.values(Difficulty).map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        difficulty === d ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={generateNewWord}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Shuffle size={20} />}
                Generate New {difficulty} Word
              </button>
            </div>

            {dailyWord && (
              <WordCard 
                word={dailyWord} 
                isSaved={savedWords.some(w => w.term === dailyWord.term)} 
                onToggleSave={handleSaveWord} 
              />
            )}
          </section>
        )}

        {currentTab === 'practice' && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Quiz & Practice</h2>
            
            {quizQuestions.length === 0 ? (
              <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 text-center space-y-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-indigo-600 shadow-sm">
                  <Trophy size={40} />
                </div>
                <h3 className="text-xl font-bold text-indigo-900">Ready for a challenge?</h3>
                <p className="text-indigo-600 font-medium">Test your knowledge with 5 dynamic questions generated from your learning path.</p>
                <button 
                  onClick={startQuiz}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Generate AI Quiz'}
                </button>
              </div>
            ) : (
              quizScore === null ? (
                <Quiz 
                  questions={quizQuestions} 
                  onComplete={handleQuizComplete} 
                  onReset={() => setQuizQuestions([])} 
                />
              ) : (
                <div className="bg-white p-10 rounded-3xl border border-slate-100 text-center space-y-6 animate-in zoom-in">
                  <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-extrabold text-slate-800">Quiz Completed!</h3>
                    <p className="text-slate-500 font-medium text-lg">You scored {quizScore} out of {quizQuestions.length}</p>
                  </div>
                  <div className="flex gap-3">
                     <button 
                      onClick={() => setQuizQuestions([])}
                      className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={() => setCurrentTab('dashboard')}
                      className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl"
                    >
                      Dashboard
                    </button>
                  </div>
                </div>
              )
            )}
          </section>
        )}

        {currentTab === 'progress' && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Your Progress</h2>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-600 flex items-center gap-2">
                  <BarChart3 size={18} /> Weekly Overview
                </h3>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">7 Day View</span>
              </div>
              
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progress.history}>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}} 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <History size={20} className="text-indigo-600" /> Saved Words History
              </h3>
              <div className="grid gap-3">
                {savedWords.length > 0 ? (
                  savedWords.map((word, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{word.term}</p>
                        <p className="text-xs text-slate-400">{word.partOfSpeech} • {word.difficulty}</p>
                      </div>
                      <button 
                        onClick={() => handleSaveWord(word)}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <LogOut size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-12 text-slate-400 font-medium italic">No saved words yet. Start learning!</p>
                )}
              </div>
            </div>
          </section>
        )}

        {currentTab === 'settings' && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Admin Control</h2>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                  <UserIcon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Faisal Ahmad</h3>
                  <p className="text-sm text-slate-500">Administrator Access</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
                      <PlusCircle size={20} />
                    </div>
                    <span className="font-bold text-slate-700">Add Word Manually</span>
                  </div>
                  <ChevronRight className="text-slate-400" />
                </div>
                 <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
                      <LayoutGrid size={20} />
                    </div>
                    <span className="font-bold text-slate-700">Manage Categories</span>
                  </div>
                  <ChevronRight className="text-slate-400" />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
                      <Search size={20} />
                    </div>
                    <span className="font-bold text-slate-700">User Audit Log</span>
                  </div>
                  <ChevronRight className="text-slate-400" />
                </div>
              </div>

              <button 
                onClick={() => setUser(null)}
                className="w-full flex items-center justify-center gap-2 py-4 text-rose-600 font-bold border-2 border-rose-50 rounded-2xl hover:bg-rose-50 transition-colors"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">Version 1.0.4 AI Powered</p>
          </section>
        )}
      </main>

      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;

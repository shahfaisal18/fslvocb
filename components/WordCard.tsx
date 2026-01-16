
import React from 'react';
import { Bookmark, BookmarkCheck, Volume2, Share2 } from 'lucide-react';
import { Word } from '../types';

interface WordCardProps {
  word: Word;
  isSaved: boolean;
  onToggleSave: (word: Word) => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, isSaved, onToggleSave }) => {
  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.term);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-indigo-900 flex items-center gap-2">
            {word.term}
            <button onClick={playAudio} className="p-1 hover:bg-slate-100 rounded-full text-indigo-500">
              <Volume2 size={20} />
            </button>
          </h2>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">
            {word.partOfSpeech} • <span className="text-indigo-600">{word.difficulty}</span>
          </p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => onToggleSave(word)}
            className={`p-2 rounded-xl transition-all ${isSaved ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}
          >
            {isSaved ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
          </button>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4">
        <p className="text-slate-700 leading-relaxed font-medium">
          {word.meaning}
        </p>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Example</h4>
        <p className="text-slate-600 italic leading-relaxed">"{word.example}"</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Synonyms</h4>
          <div className="flex flex-wrap gap-1">
            {word.synonyms.map((s, i) => (
              <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">{s}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Antonyms</h4>
          <div className="flex flex-wrap gap-1">
            {word.antonyms.map((a, i) => (
              <span key={i} className="text-xs bg-rose-50 text-rose-700 px-2 py-1 rounded-md font-medium">{a}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCard;

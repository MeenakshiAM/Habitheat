import React, { useState, useEffect } from 'react';
import { Habit, HabitTemplate } from '../types';
import { X, Clock } from 'lucide-react';

interface SaveAsTemplateProps {
  habit: Habit;
  isOpen: boolean,
  onClose: () => void;
  onSave: (template: Omit<HabitTemplate, 'id'>) => void;
}

export const SaveAsTemplateModal: React.FC<SaveAsTemplateProps> = ({habit, isOpen, onClose, onSave}) => {
  //fields to prefill
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [targetDays, setTargetDays] = useState<string[]>([]);
  const [motivationalQuote, setMotivationalQuote] = useState('');

  //fields to fill
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState<string[]>([]);

  //prefilling details
  useEffect(() => {
    if (isOpen && habit) {
      setName(habit.name || '');
      setSelectedEmoji(habit.emoji || '');
      setCategory(habit.category || '');
      setDifficulty(habit.difficulty || 'easy');
      setEstimatedTime(habit.estimatedTime || 0);
      setMotivationalQuote(habit.motivationalQuote || '');
    }
  }, [isOpen, habit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if(description.trim()) {
      onSave({
        description: description.trim(),
        tips: tips.length> 0 ?  tips : undefined,
      });

      handleClose();
    }
  }
  const handleClose = () => {
    setDescription('');
    setTips([]);
    onClose();
  }

  useEffect(() => {
    if(isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if(!isOpen) return null;  

  return(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh]  template-scroll overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Save Habit as Template
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estimated Time (minutes)
            </label>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(Number(e.target.value))}
                min="1"
                max="480"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">minutes</span>
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personal Motivation (optional)
            </label>
            <textarea
              value={motivationalQuote}
              onChange={(e) => setMotivationalQuote(e.target.value)}
              placeholder="A personal quote or reason that motivates you..."
              className="w-full h-20 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              Add Habit
            </button>
          </div>
        </form>
      </div>
  </div>
  );
}
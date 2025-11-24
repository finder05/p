import { useState, useEffect } from 'react';
import { HabitCard } from './components/HabitCard';
import { AddHabitDialog } from './components/AddHabitDialog';
import { HabitStats } from './components/HabitStats';
import { Button } from './components/ui/button';
import { Plus, TrendingUp } from 'lucide-react';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  completions: Record<string, boolean>; // date string -> completed
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Load habits from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('habits');
    if (stored) {
      try {
        setHabits(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load habits:', error);
      }
    }
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name: string, description: string, color: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      description,
      color,
      createdAt: new Date().toISOString(),
      completions: {},
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompletions = { ...habit.completions };
        newCompletions[date] = !newCompletions[date];
        return { ...habit, completions: newCompletions };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const today = new Date().toISOString().split('T')[0];

  const todayCompletions = habits.filter(habit => habit.completions[today]).length;
  const totalHabits = habits.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl">Habit Tracker</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setShowStats(!showStats)}
            >
              <TrendingUp className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm opacity-90 mb-1">Today's Progress</div>
            <div className="flex items-end gap-2">
              <div className="text-3xl">{todayCompletions}</div>
              <div className="text-lg opacity-80 mb-1">/ {totalHabits}</div>
            </div>
            {totalHabits > 0 && (
              <div className="mt-2 bg-white/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${(todayCompletions / totalHabits) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Stats View */}
        {showStats && habits.length > 0 && (
          <div className="p-4 border-b bg-slate-50">
            <HabitStats habits={habits} />
          </div>
        )}

        {/* Habits List */}
        <div className="p-4 space-y-3 pb-24">
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-slate-600 mb-2">No habits yet</h3>
              <p className="text-sm text-slate-500">Start building better habits today!</p>
            </div>
          ) : (
            habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleHabitCompletion}
                onDelete={deleteHabit}
              />
            ))
          )}
        </div>

        {/* Add Habit Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <Button
              onClick={() => setShowAddDialog(true)}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Habit
            </Button>
          </div>
        </div>

        {/* Add Habit Dialog */}
        <AddHabitDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={addHabit}
        />
      </div>
    </div>
  );
}

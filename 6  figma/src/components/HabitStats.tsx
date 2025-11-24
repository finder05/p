import { Habit } from '../App';
import { Card } from './ui/card';
import { TrendingUp, Target, Award } from 'lucide-react';

interface HabitStatsProps {
  habits: Habit[];
}

export function HabitStats({ habits }: HabitStatsProps) {
  // Calculate total completions
  const totalCompletions = habits.reduce((sum, habit) => {
    return sum + Object.values(habit.completions).filter(Boolean).length;
  }, 0);

  // Calculate best streak across all habits
  const calculateBestStreak = (habit: Habit) => {
    const dates = Object.keys(habit.completions)
      .filter(date => habit.completions[date])
      .sort();
    
    let maxStreak = 0;
    let currentStreak = 0;
    let prevDate: Date | null = null;

    dates.forEach(dateStr => {
      const currentDate = new Date(dateStr);
      
      if (prevDate) {
        const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      prevDate = currentDate;
    });
    
    return Math.max(maxStreak, currentStreak);
  };

  const bestStreak = Math.max(...habits.map(calculateBestStreak), 0);

  // Calculate completion rate for last 7 days
  const getLast7DaysRate = () => {
    let completed = 0;
    let total = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      habits.forEach(habit => {
        total++;
        if (habit.completions[dateStr]) {
          completed++;
        }
      });
    }

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const weeklyRate = getLast7DaysRate();

  return (
    <div>
      <h3 className="text-sm text-slate-600 mb-3">Your Statistics</h3>
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Award className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-xl mb-1">{totalCompletions}</div>
          <div className="text-xs text-slate-600">Total Completed</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-xl mb-1">{bestStreak}</div>
          <div className="text-xs text-slate-600">Best Streak</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl mb-1">{weeklyRate}%</div>
          <div className="text-xs text-slate-600">7-Day Rate</div>
        </Card>
      </div>
    </div>
  );
}

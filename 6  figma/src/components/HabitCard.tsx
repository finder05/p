import { useState } from 'react';
import { Habit } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Trash2, Flame } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
}

export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions[today] || false;

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (habit.completions[dateStr]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  // Get last 7 days completion status
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        completed: habit.completions[dateStr] || false,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })[0],
      });
    }
    return days;
  };

  const last7Days = getLast7Days();

  return (
    <>
      <Card className="overflow-hidden border-l-4 transition-all hover:shadow-md" style={{ borderLeftColor: habit.color }}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`habit-${habit.id}`}
              checked={isCompletedToday}
              onCheckedChange={() => onToggle(habit.id, today)}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <label
                htmlFor={`habit-${habit.id}`}
                className="cursor-pointer block"
              >
                <div className={`transition-all ${isCompletedToday ? 'opacity-60' : ''}`}>
                  <h3 className="mb-1">{habit.name}</h3>
                  {habit.description && (
                    <p className="text-sm text-slate-600">{habit.description}</p>
                  )}
                </div>
              </label>

              {/* 7-day mini calendar */}
              <div className="flex gap-1 mt-3">
                {last7Days.map((day, index) => (
                  <div key={index} className="flex-1 text-center">
                    <div className="text-xs text-slate-400 mb-1">{day.dayName}</div>
                    <div
                      className={`h-8 rounded transition-all ${
                        day.completed
                          ? 'opacity-100'
                          : 'bg-slate-100'
                      }`}
                      style={{
                        backgroundColor: day.completed ? habit.color : undefined,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Streak indicator */}
              {streak > 0 && (
                <div className="flex items-center gap-1 mt-2 text-sm text-orange-600">
                  <Flame className="w-4 h-4" />
                  <span>{streak} day streak</span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="text-slate-400 hover:text-red-600 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{habit.name}" and all its tracking data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(habit.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

import { useState } from 'react';
import { Target, Plus, CheckCircle2, Trash2, Calendar } from 'lucide-react';
import type { DeveloperGoal, GoalCategory } from '../../types/workspace.ts';
import { Badge } from '../common/Badge.tsx';
import { Button } from '../common/Button.tsx';

interface GoalsTrackerProps {
  goals: DeveloperGoal[];
  onAddGoal: (goal: Omit<DeveloperGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalsTracker({
  goals,
  onAddGoal,
  onUpdateProgress,
  onDeleteGoal,
}: GoalsTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('learning');
  const [newTargetDate, setNewTargetDate] = useState('2026-12-31');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddGoal({
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      progress: 0,
      targetDate: newTargetDate,
      isCompleted: false,
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const getCategoryBadgeVariant = (cat: GoalCategory) => {
    switch (cat) {
      case 'learning':
        return 'cyan';
      case 'open-source':
        return 'violet';
      case 'shipping':
        return 'emerald';
      case 'career':
        return 'amber';
      default:
        return 'muted';
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>Developer Growth &amp; Milestone Goals</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Track technical milestones, open-source commitments, and personal engineering goals.
          </p>
        </div>
        <Button
          size="sm"
          variant="glow-cyan"
          onClick={() => setShowAddForm(!showAddForm)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {showAddForm ? 'Cancel' : 'New Goal'}
        </Button>
      </div>

      {/* Add New Goal Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4 animate-in fade-in"
        >
          <div className="font-bold text-sm text-cyan-300 font-mono">Create Milestone Goal</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Goal title (e.g., Master Rust Concurrency)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
            <div className="flex gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as GoalCategory)}
                className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
              >
                <option value="learning">Learning</option>
                <option value="open-source">Open-Source</option>
                <option value="shipping">Shipping</option>
                <option value="career">Career</option>
                <option value="architecture">Architecture</option>
              </select>
              <input
                type="date"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>
          <textarea
            placeholder="Goal description & acceptance criteria..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={2}
            className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" variant="primary">
              Save Goal
            </Button>
          </div>
        </form>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          return (
            <div
              key={goal.id}
              className={`p-5 rounded-2xl border transition-all ${
                goal.isCompleted
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-slate-900/40 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={getCategoryBadgeVariant(goal.category)} size="sm">
                    {goal.category}
                  </Badge>
                  <h4
                    className={`font-bold text-sm sm:text-base ${
                      goal.isCompleted ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {goal.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Target: {goal.targetDate}
                  </span>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {goal.description && (
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{goal.description}</p>
              )}

              {/* Progress Slider and Quick % controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Progress</span>
                  <span
                    className={`font-bold ${
                      goal.progress >= 100 ? 'text-emerald-400' : 'text-cyan-400'
                    }`}
                  >
                    {goal.progress}% {goal.progress >= 100 && '• Completed!'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={goal.progress}
                    onChange={(e) => onUpdateProgress(goal.id, parseInt(e.target.value, 10))}
                    className="flex-1 accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <button
                    onClick={() => onUpdateProgress(goal.id, goal.progress >= 100 ? 0 : 100)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 border border-white/5 flex items-center gap-1 shrink-0"
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        goal.isCompleted ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{goal.isCompleted ? 'Done' : 'Complete'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import type { WorkspaceTask, TaskStatus, TaskPriority } from '../../types/workspace.ts';
import { Badge } from '../common/Badge.tsx';
import { Button } from '../common/Button.tsx';

interface WeeklyTasksBoardProps {
  tasks: WorkspaceTask[];
  onAddTask: (task: Omit<WorkspaceTask, 'id' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
}

export function WeeklyTasksBoard({
  tasks,
  onAddTask,
  onUpdateStatus,
  onDeleteTask,
}: WeeklyTasksBoardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Frontend');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newDueDate] = useState('This Week');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      category: newCategory.trim(),
      priority: newPriority,
      status: 'todo',
      dueDate: newDueDate.trim(),
    });

    setNewTitle('');
    setShowAddForm(false);
  };

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: 'border-slate-500/40 text-slate-300' },
    { id: 'in-progress', label: 'In Progress', color: 'border-cyan-500/50 text-cyan-300' },
    { id: 'done', label: 'Completed', color: 'border-emerald-500/50 text-emerald-300' },
  ];

  const getPriorityBadgeVariant = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return 'rose';
      case 'high':
        return 'amber';
      case 'medium':
        return 'cyan';
      default:
        return 'muted';
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <span>Weekly Sprint &amp; Task Pipeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Organize engineering deliverables, pull request reviews, and refactor tasks.
          </p>
        </div>
        <Button
          size="sm"
          variant="glow-cyan"
          onClick={() => setShowAddForm(!showAddForm)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {showAddForm ? 'Cancel' : 'Add Task'}
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 animate-in fade-in"
        >
          <div className="text-xs font-mono font-bold text-cyan-300">New Sprint Task</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="Task name (e.g., Fix WebGL canvas resize jitter)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="sm:col-span-2 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              placeholder="Category (e.g. Frontend)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" variant="primary">
              Create Task
            </Button>
          </div>
        </form>
      )}

      {/* Kanban 3-Column Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col min-h-[300px]"
            >
              <div
                className={`pb-3 mb-3 border-b flex items-center justify-between text-xs font-mono font-bold ${col.color}`}
              >
                <span>{col.label}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-300">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 hover:border-white/15 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={getPriorityBadgeVariant(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 transition-opacity p-0.5"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-medium text-xs text-white leading-snug">{task.title}</div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                      <span>{task.category}</span>
                      {task.dueDate && <span>{task.dueDate}</span>}
                    </div>

                    {/* Quick Move Status Buttons */}
                    <div className="pt-2 border-t border-white/5 flex justify-end gap-1 text-[10px] font-mono">
                      {task.status !== 'todo' && (
                        <button
                          onClick={() => onUpdateStatus(task.id, 'todo')}
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                        >
                          &larr; To Do
                        </button>
                      )}
                      {task.status !== 'in-progress' && (
                        <button
                          onClick={() => onUpdateStatus(task.id, 'in-progress')}
                          className="px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300"
                        >
                          In Progress
                        </button>
                      )}
                      {task.status !== 'done' && (
                        <button
                          onClick={() => onUpdateStatus(task.id, 'done')}
                          className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300"
                        >
                          Done &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-28 flex items-center justify-center text-xs text-slate-400 font-mono italic">
                    No tasks in {col.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

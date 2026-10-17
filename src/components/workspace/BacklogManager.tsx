import { useState } from 'react';
import { Lightbulb, Plus, Trash2 } from 'lucide-react';
import type { BacklogItem, TaskPriority } from '../../types/workspace.ts';
import { Badge } from '../common/Badge.tsx';
import { Button } from '../common/Button.tsx';

interface BacklogManagerProps {
  items: BacklogItem[];
  onAddItem: (item: Omit<BacklogItem, 'id' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, status: BacklogItem['status']) => void;
  onDeleteItem: (id: string) => void;
}

export function BacklogManager({
  items,
  onAddItem,
  onUpdateStatus,
  onDeleteItem,
}: BacklogManagerProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [tagInput, setTagInput] = useState('');
  const [hours, setHours] = useState<number>(4);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddItem({
      title: title.trim(),
      notes: notes.trim(),
      priority,
      status: 'idea',
      tags: tags.length > 0 ? tags : ['General'],
      estimatedHours: Number(hours) || undefined,
    });

    setTitle('');
    setNotes('');
    setTagInput('');
    setShowAdd(false);
  };

  const getStatusBadgeVariant = (st: BacklogItem['status']) => {
    switch (st) {
      case 'idea':
        return 'violet';
      case 'planned':
        return 'cyan';
      case 'in-review':
        return 'amber';
      case 'dropped':
        return 'rose';
      default:
        return 'muted';
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-400" />
            <span>Architecture &amp; Project Backlog</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Incubate future repository concepts, architectural refactors, and research prototypes.
          </p>
        </div>
        <Button
          size="sm"
          variant="glow-violet"
          onClick={() => setShowAdd(!showAdd)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {showAdd ? 'Cancel' : 'New Idea'}
        </Button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-3 animate-in fade-in"
        >
          <div className="text-xs font-mono font-bold text-purple-300">New Backlog Item</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Title / Concept name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="sm:col-span-2 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Tags (comma-separated, e.g. CLI, Rust, AST)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
            <input
              type="number"
              placeholder="Est. Hours"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>
          <textarea
            placeholder="Technical notes, architectural trade-offs, and reference links..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" variant="primary">
              Save Backlog Item
            </Button>
          </div>
        </form>
      )}

      {/* Backlog Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant={getStatusBadgeVariant(item.status)} size="sm">
                  {item.status}
                </Badge>
                <div className="flex items-center gap-1">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      onUpdateStatus(item.id, e.target.value as BacklogItem['status'])
                    }
                    className="bg-slate-800 text-[10px] font-mono text-slate-300 rounded px-1.5 py-0.5 border border-white/5 focus:outline-none"
                  >
                    <option value="idea">Idea</option>
                    <option value="planned">Planned</option>
                    <option value="in-review">In Review</option>
                    <option value="dropped">Dropped</option>
                  </select>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 transition-opacity p-1"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
              {item.notes && (
                <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-3">
                  {item.notes}
                </p>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="capitalize text-slate-400">{item.priority} priority</span>
              {item.estimatedHours && <span>~{item.estimatedHours} hrs</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

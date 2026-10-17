import { GoalsTracker } from './GoalsTracker.tsx';
import { WeeklyTasksBoard } from './WeeklyTasksBoard.tsx';
import { BacklogManager } from './BacklogManager.tsx';
import { DataBackupPanel } from './DataBackupPanel.tsx';
import { useWorkspace } from '../../hooks/useWorkspace.ts';
import { Badge } from '../common/Badge.tsx';

export function WorkspaceView() {
  const {
    goals,
    tasks,
    backlog,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    addTask,
    updateTaskStatus,
    deleteTask,
    addBacklogItem,
    updateBacklogStatus,
    deleteBacklogItem,
    resetDefaults,
  } = useWorkspace();

  return (
    <div className="space-y-8">
      {/* Overview stats header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="emerald" size="sm">
              Local Command Center
            </Badge>
            <Badge variant="cyan" size="sm">
              Offline Ready
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Developer Productivity Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Track weekly sprint deliverables, long-term technical learning milestones, and maintain a project concept backlog. Stored 100% in your browser.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-center min-w-[90px]">
            <div className="text-lg font-bold text-cyan-400">{goals.length}</div>
            <div className="text-[10px] text-slate-400">Goals</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-center min-w-[90px]">
            <div className="text-lg font-bold text-emerald-400">{tasks.length}</div>
            <div className="text-[10px] text-slate-400">Tasks</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-center min-w-[90px]">
            <div className="text-lg font-bold text-purple-400">{backlog.length}</div>
            <div className="text-[10px] text-slate-400">Backlog</div>
          </div>
        </div>
      </div>

      {/* Storage persistence notification & backup controls */}
      <DataBackupPanel onRefreshData={() => resetDefaults()} />

      {/* 1. Goals Tracker */}
      <GoalsTracker
        goals={goals}
        onAddGoal={addGoal}
        onUpdateProgress={updateGoalProgress}
        onDeleteGoal={deleteGoal}
      />

      {/* 2. Weekly Sprint Kanban Board */}
      <WeeklyTasksBoard
        tasks={tasks}
        onAddTask={addTask}
        onUpdateStatus={updateTaskStatus}
        onDeleteTask={deleteTask}
      />

      {/* 3. Backlog Incubator */}
      <BacklogManager
        items={backlog}
        onAddItem={addBacklogItem}
        onUpdateStatus={updateBacklogStatus}
        onDeleteItem={deleteBacklogItem}
      />
    </div>
  );
}

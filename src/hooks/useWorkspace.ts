import { useState, useEffect, useCallback } from 'react';
import type { DeveloperGoal, WorkspaceTask, BacklogItem, WorkspaceData, TaskStatus } from '../types/workspace.ts';
import { storageService } from '../services/storageService.ts';

export function useWorkspace() {
  const [data, setData] = useState<WorkspaceData>(() => storageService.getWorkspaceData());

  useEffect(() => {
    storageService.saveWorkspaceData(data);
  }, [data]);

  // Goal actions
  const addGoal = useCallback((goal: Omit<DeveloperGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: DeveloperGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      goals: [newGoal, ...prev.goals],
    }));
  }, []);

  const updateGoalProgress = useCallback((id: string, progress: number) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id
          ? {
              ...g,
              progress: Math.min(100, Math.max(0, progress)),
              isCompleted: progress >= 100,
              updatedAt: new Date().toISOString(),
            }
          : g
      ),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  }, []);

  // Task actions
  const addTask = useCallback((task: Omit<WorkspaceTask, 'id' | 'createdAt'>) => {
    const newTask: WorkspaceTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }, []);

  // Backlog actions
  const addBacklogItem = useCallback((item: Omit<BacklogItem, 'id' | 'createdAt'>) => {
    const newItem: BacklogItem = {
      ...item,
      id: `backlog-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      backlog: [newItem, ...prev.backlog],
    }));
  }, []);

  const updateBacklogStatus = useCallback((id: string, status: BacklogItem['status']) => {
    setData((prev) => ({
      ...prev,
      backlog: prev.backlog.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
  }, []);

  const deleteBacklogItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      backlog: prev.backlog.filter((b) => b.id !== id),
    }));
  }, []);

  // Backup & Reset
  const resetDefaults = useCallback(() => {
    const fresh = storageService.resetWorkspaceData();
    setData(fresh);
  }, []);

  const importBackup = useCallback((jsonString: string): boolean => {
    const success = storageService.importDataJson(jsonString);
    if (success) {
      setData(storageService.getWorkspaceData());
    }
    return success;
  }, []);

  return {
    goals: data.goals,
    tasks: data.tasks,
    backlog: data.backlog,
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
    importBackup,
  };
}

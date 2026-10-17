// Workspace Types: Goals, Weekly Tasks, and Backlog

export type GoalCategory = 'learning' | 'open-source' | 'career' | 'shipping' | 'architecture';

export interface DeveloperGoal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  progress: number; // 0 to 100
  targetDate: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface WorkspaceTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate?: string;
  githubRepo?: string;
  createdAt: string;
}

export interface BacklogItem {
  id: string;
  title: string;
  notes: string;
  priority: TaskPriority;
  status: 'idea' | 'planned' | 'in-review' | 'dropped';
  tags: string[];
  estimatedHours?: number;
  createdAt: string;
}

export interface WorkspaceData {
  goals: DeveloperGoal[];
  tasks: WorkspaceTask[];
  backlog: BacklogItem[];
  lastBackupDate: string;
}

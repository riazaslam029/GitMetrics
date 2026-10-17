import { describe, it, expect, beforeEach } from 'vitest';
import { storageService, INITIAL_GOALS, INITIAL_TASKS } from '../services/storageService.ts';

describe('Storage Service (LocalStorage Persistence)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retrieves default workspace data when storage is empty', () => {
    const data = storageService.getWorkspaceData();
    expect(data.goals.length).toBe(INITIAL_GOALS.length);
    expect(data.tasks.length).toBe(INITIAL_TASKS.length);
    expect(data.backlog.length).toBeGreaterThan(0);
  });

  it('persists and retrieves modified workspace data', () => {
    const data = storageService.getWorkspaceData();
    const customGoal = {
      id: 'custom-goal-99',
      title: 'Master WebGL Shaders',
      description: 'Write custom GLSL fragment shaders',
      category: 'learning' as const,
      progress: 50,
      targetDate: '2026-11-01',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.goals.push(customGoal);
    storageService.saveWorkspaceData(data);

    const reloaded = storageService.getWorkspaceData();
    expect(reloaded.goals.some((g) => g.id === 'custom-goal-99')).toBe(true);
  });

  it('exports workspace and portfolio as valid JSON string', () => {
    const jsonStr = storageService.exportAllDataJson();
    expect(typeof jsonStr).toBe('string');
    const parsed = JSON.parse(jsonStr);
    expect(parsed).toHaveProperty('workspace');
    expect(parsed).toHaveProperty('portfolio');
    expect(parsed.version).toBe('1.0.0');
  });

  it('successfully imports and restores a backup JSON string', () => {
    const mockBackup = {
      workspace: {
        goals: [
          {
            id: 'imported-goal-1',
            title: 'Imported Goal Test',
            description: 'Testing import',
            category: 'shipping',
            progress: 100,
            targetDate: '2026-12-31',
            isCompleted: true,
            createdAt: '2026-10-01',
            updatedAt: '2026-10-01',
          },
        ],
        tasks: [],
        backlog: [],
        lastBackupDate: '2026-10-01',
      },
      portfolio: storageService.getPortfolioConfig(),
      version: '1.0.0',
    };

    const success = storageService.importDataJson(JSON.stringify(mockBackup));
    expect(success).toBe(true);

    const updated = storageService.getWorkspaceData();
    expect(updated.goals.length).toBe(1);
    expect(updated.goals[0].title).toBe('Imported Goal Test');
  });

  it('rejects invalid or corrupted JSON gracefully during import', () => {
    const success = storageService.importDataJson('{ invalid json string ]');
    expect(success).toBe(false);
  });
});

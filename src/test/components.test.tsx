import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '../components/common/Badge.tsx';
import { StatCard } from '../components/common/StatCard.tsx';
import { RepositoryCard } from '../components/github/RepositoryCard.tsx';
import { DEMO_REPOSITORIES } from '../data/mockDemoData.ts';

describe('UI Components', () => {
  it('renders Badge component with correct text', () => {
    render(<Badge variant="cyan">TypeScript</Badge>);
    expect(screen.getByText('TypeScript')).toBeTruthy();
  });

  it('renders StatCard with title, value, and subtitle', () => {
    render(
      <StatCard
        title="Public Repos"
        value={42}
        subtitle="Active open-source repositories"
        accent="cyan"
      />
    );
    expect(screen.getByText('Public Repos')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText('Active open-source repositories')).toBeTruthy();
  });

  it('renders RepositoryCard and handles portfolio toggle interaction', () => {
    const handleToggle = vi.fn();
    const repo = DEMO_REPOSITORIES[0];

    render(
      <RepositoryCard
        repo={repo}
        isPortfolioSelected={false}
        onTogglePortfolio={handleToggle}
      />
    );

    expect(screen.getByText(repo.name)).toBeTruthy();
    expect(screen.getByText(repo.language || '')).toBeTruthy();

    const pinButton = screen.getByTitle('Add to Portfolio');
    fireEvent.click(pinButton);
    expect(handleToggle).toHaveBeenCalledWith(repo);
  });
});

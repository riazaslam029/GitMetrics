import { HeroSection } from './HeroSection.tsx';
import { FeatureBento } from './FeatureBento.tsx';
import { ThemeShowcase } from './ThemeShowcase.tsx';
import { OpenSourceCallout } from './OpenSourceCallout.tsx';
import type { NavTab } from '../common/Navbar.tsx';
import type { PortfolioThemeId } from '../../types/portfolio.ts';

interface LandingPageViewProps {
  onTabChange: (tab: NavTab) => void;
  onSearchUsername: (user: string) => void;
  currentUsername: string;
  onSelectTheme: (theme: PortfolioThemeId) => void;
}

export function LandingPageView({
  onTabChange,
  onSearchUsername,
  currentUsername,
  onSelectTheme,
}: LandingPageViewProps) {
  return (
    <div className="space-y-4">
      <HeroSection
        onTabChange={onTabChange}
        onSearchUsername={onSearchUsername}
        currentUsername={currentUsername}
      />
      <FeatureBento onTabChange={onTabChange} />
      <ThemeShowcase onTabChange={onTabChange} onSelectTheme={onSelectTheme} />
      <OpenSourceCallout />
    </div>
  );
}

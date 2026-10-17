import { describe, it, expect } from 'vitest';
import { generateStandalonePortfolioHtml } from '../services/exportService.ts';
import { INITIAL_PORTFOLIO } from '../services/storageService.ts';

describe('Export Service (Standalone HTML Portfolio Generator)', () => {
  it('generates a complete valid HTML5 document containing user profile details', () => {
    const html = generateStandalonePortfolioHtml(INITIAL_PORTFOLIO);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain(INITIAL_PORTFOLIO.fullName);
    expect(html).toContain('Full-Stack Systems Architect &amp; Creative Technologist');
    expect(html).toContain(INITIAL_PORTFOLIO.bio);
    expect(html).toContain('</html>');
  });

  it('embeds configured projects and tags inside the generated output', () => {
    const html = generateStandalonePortfolioHtml(INITIAL_PORTFOLIO);

    INITIAL_PORTFOLIO.projects.forEach((proj) => {
      expect(html).toContain(proj.name);
    });
  });

  it('embeds technical skills inside technical capabilities section', () => {
    const html = generateStandalonePortfolioHtml(INITIAL_PORTFOLIO);

    expect(html).toContain('Technical Capabilities');
    expect(html).toContain('TypeScript');
    expect(html).toContain('Rust');
  });

  it('escapes dangerous HTML characters to prevent XSS in generated portfolios', () => {
    const unsafeConfig = {
      ...INITIAL_PORTFOLIO,
      fullName: '<script>alert("xss")</script> John Doe',
    };

    const html = generateStandalonePortfolioHtml(unsafeConfig);
    expect(html).not.toContain('<script>alert("xss")</script>');
    expect(html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; John Doe');
  });
});

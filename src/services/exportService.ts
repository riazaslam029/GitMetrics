import type { PortfolioConfig } from '../types/portfolio.ts';
import { PORTFOLIO_THEMES } from '../components/portfolio/themes.ts';

export function downloadFile(filename: string, content: string, mimeType = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateStandalonePortfolioHtml(config: PortfolioConfig): string {
  const theme = PORTFOLIO_THEMES[config.theme] || PORTFOLIO_THEMES['neon-obsidian'];

  const projectsHtml = config.projects
    .map(
      (p) => `
      <article class="project-card">
        <div class="project-header">
          <span class="project-lang">${escapeHtml(p.language || 'Code')}</span>
          <div class="project-metrics">
            <span title="Stars">&#9733; ${p.stars}</span>
            <span title="Forks">&#9282; ${p.forks}</span>
          </div>
        </div>
        <h3 class="project-title">${escapeHtml(p.name)}</h3>
        <p class="project-desc">${escapeHtml(p.description || 'No description provided.')}</p>
        <div class="project-tags">
          ${p.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="link-btn primary">GitHub Code &rarr;</a>
          ${
            p.homepage
              ? `<a href="${escapeHtml(p.homepage)}" target="_blank" rel="noopener noreferrer" class="link-btn secondary">Live Demo &nearr;</a>`
              : ''
          }
        </div>
      </article>
    `
    )
    .join('');

  const skillsLangsHtml = config.skills.languages
    .map((s) => `<span class="skill-chip">${escapeHtml(s)}</span>`)
    .join('');
  const skillsFrameworksHtml = config.skills.frameworks
    .map((s) => `<span class="skill-chip">${escapeHtml(s)}</span>`)
    .join('');
  const skillsToolsHtml = config.skills.tools
    .map((s) => `<span class="skill-chip">${escapeHtml(s)}</span>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.fullName)} | Developer Portfolio</title>
  <meta name="description" content="${escapeHtml(config.headline)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: ${theme.id === 'cyberpunk-emerald' ? '#050B08' : theme.id === 'cosmic-violet' ? '#090614' : theme.id === 'nordic-monolith' ? '#0B0D11' : '#060810'};
      --surface: ${theme.cardBg};
      --primary: ${theme.primaryColor};
      --accent: ${theme.accentColor};
      --text: #F8FAFC;
      --text-muted: #94A3B8;
      --border: rgba(255, 255, 255, 0.08);
      --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      line-height: 1.6;
      padding: 0 1.5rem;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 4rem 0 6rem;
    }
    header.hero {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding-bottom: 3rem;
      border-bottom: 1px solid var(--border);
    }
    .profile-row {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .avatar {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 3px solid var(--primary);
      object-fit: cover;
      box-shadow: 0 0 25px rgba(0,0,0,0.5);
    }
    .title-group h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.2;
    }
    .title-group p.headline {
      font-size: 1.25rem;
      color: var(--primary);
      font-family: var(--font-mono);
      font-weight: 500;
      margin-top: 0.25rem;
    }
    .title-group p.location {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-top: 0.25rem;
    }
    .bio {
      font-size: 1.1rem;
      color: #CBD5E1;
      max-width: 780px;
    }
    .social-links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .social-links a {
      color: var(--text);
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }
    .social-links a:hover {
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-2px);
    }
    section {
      margin-top: 4rem;
    }
    section h2 {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    section h2::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 1.5rem;
      background: var(--primary);
      border-radius: 2px;
    }
    /* Projects Grid */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .project-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      transition: all 0.25s ease;
    }
    .project-card:hover {
      border-color: var(--primary);
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.4);
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .project-lang {
      font-size: 0.8rem;
      font-family: var(--font-mono);
      background: rgba(255, 255, 255, 0.05);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      color: var(--primary);
      font-weight: 600;
    }
    .project-metrics {
      display: flex;
      gap: 0.75rem;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .project-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .project-desc {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 1rem;
      flex-grow: 1;
    }
    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }
    .tag {
      background: rgba(255, 255, 255, 0.04);
      color: #94A3B8;
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .project-links {
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
    }
    .link-btn {
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .link-btn.primary {
      background: var(--primary);
      color: #000;
      font-weight: 600;
    }
    .link-btn.secondary {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
    }
    .link-btn.secondary:hover {
      border-color: var(--text);
    }
    /* Skills Section */
    .skills-category {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }
    .skills-category h4 {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }
    .chips-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .skill-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #F1F5F9;
      padding: 0.35rem 0.8rem;
      border-radius: 6px;
      font-size: 0.9rem;
    }
    footer {
      margin-top: 6rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-muted);
      font-size: 0.85rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    footer a {
      color: var(--primary);
      text-decoration: none;
    }
    @media (max-width: 640px) {
      .title-group h1 { font-size: 2rem; }
      .profile-row { flex-direction: column; align-items: flex-start; }
      .projects-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="hero">
      <div class="profile-row">
        ${config.avatarUrl ? `<img src="${escapeHtml(config.avatarUrl)}" alt="${escapeHtml(config.fullName)}" class="avatar" />` : ''}
        <div class="title-group">
          <h1>${escapeHtml(config.fullName)}</h1>
          <p class="headline">${escapeHtml(config.headline)}</p>
          ${config.location ? `<p class="location">&#9678; ${escapeHtml(config.location)}</p>` : ''}
        </div>
      </div>
      <p class="bio">${escapeHtml(config.bio)}</p>
      <div class="social-links">
        ${config.socials.github ? `<a href="${escapeHtml(config.socials.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
        ${config.socials.website ? `<a href="${escapeHtml(config.socials.website)}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}
        ${config.socials.twitter ? `<a href="${escapeHtml(config.socials.twitter)}" target="_blank" rel="noopener noreferrer">Twitter / X</a>` : ''}
        ${config.socials.linkedin ? `<a href="${escapeHtml(config.socials.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : ''}
        ${config.socials.email ? `<a href="mailto:${escapeHtml(config.socials.email)}">Contact Email</a>` : ''}
      </div>
    </header>

    ${
      config.visibleSections.featuredProjects && config.projects.length > 0
        ? `
    <section id="projects">
      <h2>Featured Engineering Projects</h2>
      <div class="projects-grid">
        ${projectsHtml}
      </div>
    </section>
    `
        : ''
    }

    ${
      config.visibleSections.skills
        ? `
    <section id="skills">
      <h2>Technical Capabilities</h2>
      <div class="skills-category">
        <h4>Core Languages</h4>
        <div class="chips-wrap">${skillsLangsHtml}</div>
      </div>
      <div class="skills-category">
        <h4>Frameworks &amp; Architecture</h4>
        <div class="chips-wrap">${skillsFrameworksHtml}</div>
      </div>
      <div class="skills-category">
        <h4>Tools &amp; Infrastructure</h4>
        <div class="chips-wrap">${skillsToolsHtml}</div>
      </div>
    </section>
    `
        : ''
    }

    <footer>
      <div>&copy; ${new Date().getFullYear()} ${escapeHtml(config.fullName)}. Built with <a href="https://github.com/riazaslam029/GitMetrics" target="_blank" rel="noopener noreferrer">GitMetrics</a>.</div>
      <div>Theme: ${escapeHtml(theme.name)}</div>
    </footer>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

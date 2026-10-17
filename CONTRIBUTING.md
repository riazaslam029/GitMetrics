# Contributing to DevFolio OS

Thank you for your interest in contributing to **DevFolio OS**! We welcome contributions from developers, designers, and students of all backgrounds.

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/alex-dev/devfolio-os.git
   cd devfolio-os
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. **Run the test suite**:
   ```bash
   npm run test
   ```

5. **Verify type check & production build**:
   ```bash
   npm run build
   ```

## Development Guidelines

- **Zero Fabricated Data**: DevFolio OS strictly queries real public endpoints or uses clearly-identified demo datasets. Never hardcode fake contribution calendars or misleading user counts.
- **Client-Side Privacy**: Personal goals and settings belong exclusively in LocalStorage. Do not add analytics trackers or telemetry without explicit user opt-in.
- **60fps Graphics & WebGL Performance**: Capped DPR (`Math.min(window.devicePixelRatio, 2)`) must be maintained on Three.js scenes, with 2D fallbacks for reduced-motion and mobile.
- **Clean Commits**: Write descriptive, imperative commit messages (`feat: add ...`, `fix: resolve ...`).

## Pull Request Process

1. Fork the repository and create your feature branch from `main`:
   ```bash
   git checkout -b feature/amazing-enhancement
   ```
2. Commit your changes and verify that `npm run test` and `npm run build` both pass without errors.
3. Push to your branch and open a Pull Request describing your changes.

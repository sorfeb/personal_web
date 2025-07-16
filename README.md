# PERSONAL WEB v1.5

![thumbnail-sorOS](https://github.com/user-attachments/assets/743b0bc7-2527-442c-81a2-9b011db61341)

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection required for optimal experience

## File Structure

```
personal_web/
├── public/                # Static assets (images, icons, favicon, robots.txt, etc.)
├── src/
│   ├── app/               # Next.js app directory (pages, layouts, routes)
│   ├── components/        # Reusable React components (UI, widgets, etc.)
│   ├── context/           # React context providers (global state, volume, tours)
│   ├── data/              # Static data files (JSON, TypeScript lists)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # API route handlers (Next.js API)
│   ├── stories/           # Storybook stories and related assets
│   └── utils/             # Utility/helper functions
├── .storybook/            # Storybook configuration files
├── .vscode/               # VSCode workspace settings
├── package.json           # Project dependencies and scripts
├── next.config.mjs        # Next.js configuration
├── next-sitemap.config.js # Sitemap generation config
├── .eslintrc.json         # ESLint configuration
├── .stylelintrc.json      # Stylelint configuration
├── .hintrc                # Webhint configuration
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

**Description:**This project follows a modular structure for scalability and maintainability.

- All source code is under `src/`, organized by feature and type (components, data, hooks, etc.).
- Static assets are in `public/`.
- Configuration files for tools like Next.js, Storybook, ESLint, and Stylelint are at the root.
- Storybook stories and related assets are in `src/stories/`.
- API routes are handled in `src/pages/api/`.
- Utility functions and React contexts are separated for clarity and reuse.

## Installation

```bash
# INSTALL REQUIRED DEPENDENCIES:
npm install

# LAUNCH THE DASHBOARD:
npm run dev
```

Then navigate your web browser to [http://localhost:3000](http://localhost:3000)

## Storybook UI Guide

Storybook provides an isolated environment to develop, test, and review UI components.

<img width="1909" height="918" alt="screenshot-1752667940051" src="https://github.com/user-attachments/assets/8ed818e3-bdc4-4dec-a0ee-51d339f3dd66" />


### Launch Storybook

```bash
npm run storybook
```

Then open [http://localhost:6006](http://localhost:6006) in your browser.

### Navigating Storybook

- **Component List (Sidebar):** Browse all available UI components and pages in the left sidebar.
- **Canvas:** View and interact with the selected component in the main area.
- **Docs Tab:** See documentation, usage examples, and props for each component.
- **Controls Panel:** Adjust component props dynamically to preview different states.
- **Toolbar:** Use addons like Viewports to test responsiveness or switch between light/dark themes.


## Features

### Next.js 15 Powered Engine

Built on the high-performance Next.js framework with lightning-fast page transitions and server-side rendering capabilities!

### Interactive Sound System

Complete with click sounds and volume controls for the authentic dashboard experience!

### Framer Motion Animations

Smooth, responsive animations bring the interface to life with every interaction!

## Snapshots

<img width="1806" height="915" alt="screenshot-1752668049924" src="https://github.com/user-attachments/assets/046b7ce1-2b21-4a7d-960c-10b0137ffeba" />

<img width="1803" height="917" alt="image" src="https://github.com/user-attachments/assets/f73f62ef-c502-4c1d-b8d8-fc01284beeb9" />

<img width="1742" height="907" alt="image" src="https://github.com/user-attachments/assets/31f65e55-df59-4e28-b981-ee58b78bcb02" />

© 2025 Soros Febriano
All Rights Reserved.

# PERSONAL WEB v1.0

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

Storybook is ideal for visually testing components, reviewing UI states, and sharing component libraries with your team.

## Features

### Next.js Powered Engine

Built on the high-performance Next.js framework with lightning-fast page transitions and server-side rendering capabilities!

### Interactive Sound System

Complete with click sounds and volume controls for the authentic dashboard experience!

### Framer Motion Animations

Smooth, responsive animations bring the interface to life with every interaction!

## Dashboard Sections

### Home World

Central hub with intuitive navigation controls to all other sections.

### About

Information about the NXE Dashboard inspiration and technical details of this web experience.

### Profile

Your digital identity center with customizable options.

### Media Collection

* **Photos** - Visual gallery of captured moments
* **Media** - Mixed media content browser
* **Music** - Audio experience center
* **Books** - Literary collection interface
* **Digital Gems** - Special collection of digital artifacts

### Entertainment Center

* **Leetcode** - Coding challenges and solutions
* **Letterboxd** - Film rating and review portal
* **My Playlists** - Spotify playlist integration with pagination controls
* **Blog** - Latest thoughts and updates

### Professional Hub

* **Certifications** - Professional achievements showcase

### Connection Portals

* **Github** - Direct link to code repositories
* **External Services** - Seamless integration with third-party platforms

### Credits

* **Technologies** - Technical specifications used in development
* **Assets** - Attribution for media elements and resources

## Technical Specifications

* Built with cutting-edge web technologies:
* Next.js Framework
* Framer Motion
* jQuery
* CSS Modules
* React Context API
* RESTful API Integration

© 2025 Soros Febriano
All Rights Reserved.

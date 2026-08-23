import React from 'react';
import styles from '../About.module.css';

/**
 * The prose panel. Keeps the NXE passage the page has always opened with, and
 * adds the part it was missing: who built this and why it looks like a console.
 */
const AboutPanel = () => (
  <div className={styles.prose}>
    <p>
      This is a personal site wearing the Xbox 360 dashboard as a costume. Blades, cards, the
      Guide, the boot sound, a media player skinned like Windows Media Player: if the console
      did it, this tries to do it too, in a browser, with a controller if you have one plugged
      in.
    </p>

    <p className={styles.quote}>
      The &ldquo;NXE&rdquo; update, which stands for &ldquo;New Xbox Experience,&rdquo; was a
      major system update for the Xbox 360 that significantly redesigned the dashboard, adding
      features like avatar creation, the ability to install games directly to the hard drive
      for faster loading times, a revamped Xbox Guide, and improved multimedia capabilities,
      essentially providing a more modern and user-friendly interface compared to previous
      Xbox 360 dashboards; it was initially released in November 2008 and required users to
      have a storage device like a memory card or hard drive to install.
    </p>

    <p className={styles.colophon}>&copy; 2026 Soros Febriano</p>
  </div>
);

export default AboutPanel;

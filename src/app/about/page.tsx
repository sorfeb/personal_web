'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';

const AboutPage = () => {
  return (
    <PageLayout title="About">
      <p>
      <i>The "NXE" update, which stands for "New Xbox Experience," 
        was a major system update for the Xbox 360 that significantly 
        redesigned the dashboard, adding features like avatar creation, 
        the ability to install games directly to the hard drive for faster loading times, 
        a revamped Xbox Guide, and improved multimedia capabilities, essentially providing
        a more modern and user-friendly interface compared to previous Xbox 360 
        dashboards; it was initially released in November 2008 and required users to 
        have a storage device like a memory card or hard drive to install.</i>
      </p>
      <p>Made with Next.js, Framer Motion, jQuery, and CSS.</p>
      <p>© 2025 Soros Febriano</p>
    </PageLayout>
  );
};

export default AboutPage;
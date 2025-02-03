'use client';

import React, { useEffect } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './page.module.css';
import projects from '../../data/projects.json'; // Import projects JSON

const ProjectsPage = () => {
  const technologies = [
    { name: 'Python', logo: 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white' },
    { name: 'Java', logo: 'https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white' },
    { name: 'HTML & CSS', logo: 'https://img.shields.io/badge/HTML%20%26%20CSS-E34F26?style=for-the-badge&logo=html5&logoColor=white' },
    { name: 'JavaScript', logo: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black' }
  ];

  useEffect(() => {
    const carousel = document.querySelector(`.${styles.carousel}`);
    if (carousel) {
      const clone = carousel.innerHTML;
      carousel.innerHTML += clone; // Duplicate elements for seamless scrolling
    }
  }, []);

  return (
    <PageLayout title="Projects">
      <div className={styles.container}>
        {/* Technology Carousel */}
        <div className={styles.carouselWrapper}>
          <div className={styles.carousel}>
            {technologies.map((tech, index) => (
              <div key={index} className={styles.techItem}>
                <img src={tech.logo} alt={tech.name} className={styles.techLogo} />
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Project Cards */}
        <div className={styles.projects}>
          {projects.map((project, index) => (
            <div key={index} className={styles.projectCard}>
              <h3>{project.projectName}</h3>
              <p><strong>Role:</strong> {project.role}</p>
              <p><strong>Date:</strong> {project.date}</p>
              <p>{project.description}</p>
              <p><strong>Technologies:</strong> {project.keyTechnologies.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ProjectsPage;

'use client';

import React, { useEffect } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import useMeasure from 'react-use-measure';
import styles from './page.module.css';
import { animate, motion, useMotionValue } from 'framer-motion';

const ProjectsPage = () => {

  const technologies = [
    { name: 'Python', logo: 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white' },
    { name: 'Java', logo: 'https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white' },
    { name: 'HTML & CSS', logo: 'https://img.shields.io/badge/HTML%20%26%20CSS-E34F26?style=for-the-badge&logo=html5&logoColor=white' },
    { name: 'JavaScript', logo: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black' },
    { name: 'Figma', logo: 'https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white' },
    { name: 'ThreeJS', logo: 'https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white' },
    { name: 'Bootstrap', logo: 'https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white' },
    { name: 'Tailwind', logo: 'https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white' },
    { name: 'Next.js', logo: 'https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white' },
    { name: 'React', logo: 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB' },
    { name: 'Django', logo: 'https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white' },
    { name: 'Spring Boot', logo: 'https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white' },
    { name: 'Go', logo: 'https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white' },
    { name: 'Dart', logo: 'https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white' },
    { name: 'Adobe Photoshop', logo: 'https://img.shields.io/badge/Adobe%20Photoshop-31A8FF?style=for-the-badge&logo=adobe-photoshop&logoColor=white' },
    { name: 'Adobe Premiere Pro', logo: 'https://img.shields.io/badge/Adobe%20Premiere%20Pro-9999FF?style=for-the-badge&logo=adobe-premiere-pro&logoColor=white' },
    { name: 'Kaggle', logo: 'https://img.shields.io/badge/Kaggle-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white' },
    { name: 'Google Colab', logo: 'https://img.shields.io/badge/Google%20Colab-F9AB00?style=for-the-badge&logo=google-colab&logoColor=white' },
    { name: 'PyTorch', logo: 'https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white' },
    { name: 'Whisper', logo: 'https://img.shields.io/badge/OpenAI_Whisper-0096FF?style=for-the-badge&logo=openai&logoColor=white' },
    { name: 'TensorFlow', logo: 'https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white' },
    { name: 'SciKit', logo: 'https://img.shields.io/badge/Scikit_Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white' },
    { name: 'Google Cloud', logo: 'https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white' }
  ];

  let [ref, { width }] = useMeasure();
  
  const xTranslation = useMotionValue(0);
  
  useEffect(() => {
    let controls;
    let finalPosition = -width / 2 - 8 ;
  
    controls = animate(xTranslation, [0, finalPosition], {
      ease: 'linear',
      duration: 25,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
    });
  }, [xTranslation, width]);

  return (
    <PageLayout title="Projects">
      <div className={styles.container}>
        <div className={styles.carouselWrapper}>
          <motion.div
            className={styles.carousel}
            ref = {ref}
            style = {{ x: xTranslation }}
          >
            {[...technologies, ...technologies].map((tech, index) => (
              <div key={index} className={styles.techItem}>
                <img src={tech.logo} alt={tech.name} className={styles.techLogo} />
              </div>
            ))}
          </motion.div>
        </div>
        <div className={styles.projects}>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProjectsPage;

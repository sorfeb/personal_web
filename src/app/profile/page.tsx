'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './page.module.css';
import { useVolume } from '../../context/VolumeContext';

const ProfilePage: React.FC = () => {

  const { volume } = useVolume();
  const playSound = () => {
    const audio = new Audio('/assets/audio/ps2_divine.wav');
    audio.volume = volume;
    audio.play();
  };  

  return (
    <PageLayout title="Profile">
      <div className={styles.profileContainer}>
        <div className={styles.textSection}>
          <p>
            A Computer Science student at Universitas Indonesia, captivated by the vibrant fusion of technology 
            and art that defines our era. In a world where artificial intelligence, cloud computing, and immersive 
            technologies continually reshape our future, I find beauty in weaving lines of code with creative expression.
          </p> 
          <p>
            My ambition is to build purposeful, meticulously engineered software that resonates
            with people on a profound level—software that isn’t just functional, but inspires
            a sense of wonder. I believe that integrating design, artistry, and technical
            prowess can spark new forms of connection and empathy, transforming routine
            digital tools into experiences that enrich our global community, further
            accelerating humanity’s progress to be all connected in The Wired.
          </p>
          <p>
            Drawn to art and innovation from every corner of the world, I strive to craft solutions that reflect 
            diverse perspectives, uplifting individuals and bridging cultures. Each endeavor is an opportunity to 
            push the boundaries between logic and creativity, as I work to leave a positive mark on the ever-evolving 
            tapestry of modern technology.
          </p>

          {/* Contact Section */}
          <div className={styles.contactSection}>
            <h2 className={`${styles.contactText} ${styles.shineText}`}>Contact me:</h2>
            <div className={`${styles.contactLinks} ${styles.reflection}`}>
              <a
                href="https://www.linkedin.com/in/soros-febriano/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="assets/icons/pages/profile/linkedin.svg"
                  width="30"
                  alt="LinkedIn"
                  className={`${styles.icon} ${styles.linkedinIcon}`}
                  onMouseEnter={() => playSound()}
                />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.imageSection}>
          <img
            src="/assets/images/myBody.png"
            alt="Profile Picture"
            className={styles.profileImage}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;

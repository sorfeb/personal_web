import React from 'react';

export const popupContentMap = {
  About: <p>This is the About section. Here you can learn more about me.</p>,
  Profile: <img src="/assets/icons/myface.png" alt="Profile" />,
  Certifications: (
    <ul>
      <li>Certification 1</li>
      <li>Certification 2</li>
    </ul>
  ),
  Projects: (
    <div>
      <h4>My Projects</h4>
      <p>Here are some of my projects:</p>
      <ul>
        <li>Project 1</li>
        <li>Project 2</li>
      </ul>
    </div>
  ),
  Settings: <p>Customize your settings here.</p>,
  Blog: <iframe src="https://www.medium.com" width="600" height="400" />,
  Github: <a href="https://github.com/your-username">Visit my GitHub</a>,
  Photos: <img src="/assets/icons/camera.svg" alt="Photos" />,
  Music: <audio controls src="/assets/audio/sample.mp3" />,
  Books: <p>Here are some of my favorite books.</p>,
  "Digital Gems": <p>Explore my collection of digital gems.</p>,
  Media: <video controls src="/assets/videos/sample.mp4" />,
  Jomok: <p>Credits to Jomok for their contributions.</p>,
};
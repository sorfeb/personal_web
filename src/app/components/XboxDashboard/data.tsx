import React from 'react';

const data = {
  home: [
    {
      title: "About",
      iconUrl: "assets/icons/about.svg",
      popupContent: <p>This is the About section. Here you can learn more about me.</p>,
    },
    {
      title: "Profile",
      iconUrl: "/assets/icons/myface.png",
      popupContent: <img src="/assets/icons/myface.png" alt="Profile" />,
    },
    {
      title: "Certifications",
      iconUrl: "assets/icons/certificate.svg",
      popupContent: (
        <ul>
          <li>Certification 1</li>
          <li>Certification 2</li>
        </ul>
      ),
    },
    {
      title: "Projects",
      iconUrl: "assets/icons/project.svg",
      popupContent: (
        <div>
          <h4>My Projects</h4>
          <p>Here are some of my projects:</p>
          <ul>
            <li>Project 1</li>
            <li>Project 2</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Settings",
      iconUrl: "assets/icons/settings.svg",
      popupContent: <p>Customize your settings here.</p>,
    },
  ],
  misc: [
    {
      title: "Blog",
      iconUrl: "assets/icons/blog.svg",
      popupContent: "...",
    },
    {
      title: "Github",
      iconUrl: "assets/icons/github.svg",
      popupContent: <a href="https://github.com/your-username">Visit my GitHub</a>,
    },
    {
      title: "Leetcode",
      iconUrl: "assets/icons/leetcode.svg",
      popupContent: <p>Check out my Leetcode profile.</p>,
    },
    {
      title: "Letterboxd",
      iconUrl: "assets/icons/letterboxd.svg",
      popupContent: <p>Explore my Letterboxd reviews.</p>,
    },
    {
      title: "Last.fm",
      iconUrl: "assets/icons/lastfm.svg",
      popupContent: <p>See what I'm listening to on Last.fm.</p>,
    },
  ],
  gallery: [
    {
      title: "Photos",
      iconUrl: "assets/icons/camera.svg",
      popupContent: <img src="/assets/icons/camera.svg" alt="Photos" />,
    },
    {
      title: "Music",
      iconUrl: "assets/icons/music.svg",
      popupContent: <audio controls src="/assets/audio/sample.mp3" />,
    },
    {
      title: "Books",
      iconUrl: "assets/icons/books.svg",
      popupContent: <p>Here are some of my favorite books.</p>,
    },
    {
      title: "Digital Gems",
      iconUrl: "assets/icons/gemstone.svg",
      popupContent: <p>Explore my collection of digital gems.</p>,
    },
    {
      title: "Media",
      iconUrl: "assets/icons/gallery.svg",
      popupContent: <video controls src="/assets/videos/sample.mp4" />,
    },
  ],
  credits: [
    {
      title: "Jomok",
      iconUrl: "assets/icons/music.svg",
      popupContent: <p>Credits to Jomok for their contributions.</p>,
    },
    {
      title: "Jomok",
      iconUrl: "/public/assets/icons/store-icon.png",
      popupContent: <p>More credits to Jomok.</p>,
    },
  ],
};

export default data;
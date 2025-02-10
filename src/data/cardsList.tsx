const data = {
  home: [
    { 
      title: "About", 
      iconUrl: "assets/icons/dashboard/home/about.svg",
      route: "/about" 
    },
    { 
      title: "Profile", 
      iconUrl: "/assets/icons/dashboard/home/myface.png",
      route: "/profile"
    },
    { 
      title: "Certifications", 
      iconUrl: "assets/icons/dashboard/home/certificate.svg",
      route: "/certifications"
    },
    { 
      title: "Projects", 
      iconUrl: "assets/icons/dashboard/home/project.svg",
      route: "/projects"
    },
  ],
  misc: [
    { 
      title: "Blog", 
      iconUrl: "assets/icons/dashboard/misc/blog.svg",
      route: "/blog" 
    },
    { 
      title: "Github", 
      iconUrl: "assets/icons/dashboard/misc/github.svg",
      route: "/github"
    },
    { 
      title: "Leetcode", 
      iconUrl: "assets/icons/dashboard/misc/leetcode.svg",
      route: "/leetcode"
    },
    { 
      title: "Letterboxd", 
      iconUrl: "assets/icons/dashboard/misc/letterboxd.svg",
      route: "https://letterboxd.com" // External link to Letterboxd
    },
    { 
      title: "Last.fm", 
      iconUrl: "assets/icons/dashboard/misc/lastfm.svg",
      route: "https://last.fm" // External link to Last.fm
    },
    { 
      title: "My Playlists", 
      images: [
        'https://mosaic.scdn.co/640/ab67616d00001e02512219d757d294b1b8ceb6fdab67616d00001e02b95dc41b1ea299b71415c870ab67616d00001e02d6ebb6f586a549c57189f2f9ab67616d00001e02e82b9063af74c25efea29973',
        'https://mosaic.scdn.co/640/ab67616d00001e0259eaf2f9fca6f4c449fc9fc0ab67616d00001e02aec44761574de2a7e8784f11ab67616d00001e02cb9172e927b9f4a7eba3e992ab67616d00001e02d421c7b2de6846831a2c3814',
        'https://mosaic.scdn.co/640/ab67616d00001e0209835613d695644fbc99cf9cab67616d00001e021d1ff8b3a6fe52ee3123078eab67616d00001e023607a6aab3a44e9d6cb71e41ab67616d00001e0278eea627fe9c77256adea633',
      ]
    },
  ],
  gallery: [
    { 
      title: "Photos", 
      iconUrl: "assets/icons/dashboard/gallery/camera.svg",
      route: "/photos" // Route to the Photos page
    },
    { 
      title: "Music", 
      iconUrl: "assets/icons/dashboard/gallery/music.svg",
      route: "/music" // Route to the Music page
    },
    { 
      title: "Books", 
      iconUrl: "assets/icons/dashboard/gallery/books.svg",
      route: "/books" // Route to the Books page
    },
    { 
      title: "Digital Gems", 
      iconUrl: "assets/icons/dashboard/gallery/gemstone.svg",
      route: "/digital-gems" // Route to the Digital Gems page
    },
    { 
      title: "Media", 
      iconUrl: "assets/icons/dashboard/gallery/gallery.svg",
      route: "/media" 
    },
  ],
  credits: [
    { 
      title: "Technologies", 
      iconUrl: "assets/icons/dashboard/home/settings.svg",
      route: "/credits-tech"
    },
    { 
      title: "Assets", 
      iconUrl: "/assets/icons/dashboard/credits/media.png",
      route: "/credits-assets"
    },
  ],
};

export default data;
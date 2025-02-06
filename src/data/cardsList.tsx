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
      route: "/profile" // Route to the Profile page
    },
    { 
      title: "Certifications", 
      iconUrl: "assets/icons/dashboard/home/certificate.svg",
      route: "/certifications" // Route to the Certifications page
    },
    { 
      title: "Projects", 
      iconUrl: "assets/icons/dashboard/home/project.svg",
      route: "/projects" // Route to the Projects page
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
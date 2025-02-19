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
      title: "My Playlists", 
      images: [
        'https://mosaic.scdn.co/640/ab67616d00001e0200a65bd6ba6b636c3ba1539fab67616d00001e020960f0681fc6e31fdc55cc43ab67616d00001e029683e5d7361bb80bfb00f46dab67616d00001e02ea7caaff71dea1051d49b2fe',
        'https://mosaic.scdn.co/640/ab67616d00001e0270622da427271b0203d7ce79ab67616d00001e0284426b19844492cccbe23876ab67616d00001e02d6be58f07b858364845c13b9ab67616d00001e02e5234dab5a91ec9e75564184',
        'https://mosaic.scdn.co/640/ab67616d00001e0236e70e5a7c5ce7530e1e1bfdab67616d00001e023af75558ae8bf4afc6f4c6e9ab67616d00001e029ec4abd35652fafe34ee7dfbab67616d00001e02b1bb0209c3f29678f62bf071',
        'https://mosaic.scdn.co/640/ab67616d00001e023d15323e148511fc307d95bdab67616d00001e0245643f5cf119cbc9d2811c22ab67616d00001e028cc1e0b31aade5ecbad2af4aab67616d00001e02d990653ea71f3ef4bf46d27b'
      ],
      route: "/my-playlists"
    },
    { 
      title: "Blog", 
      iconUrl: "assets/icons/dashboard/misc/blog.svg",
      route: "/blog" 
    },
    { 
      title: "Github", 
      iconUrl: "assets/icons/dashboard/misc/github.svg",
      route: "https://github.com/sorfeb"
    },
    { 
      title: "Leetcode", 
      iconUrl: "assets/icons/dashboard/misc/leetcode.svg",
      route: "/leetcode"
    },
    { 
      title: "Letterboxd", 
      iconUrl: "assets/icons/dashboard/misc/letterboxd.svg",
      route: "https://letterboxd.com/21watchingeyes/"
    },
  ],
  gallery: [
    { 
      title: "Photos", 
      iconUrl: "assets/icons/dashboard/gallery/camera.svg",
      route: "/photos"
    },
    { 
      title: "Media", 
      iconUrl: "assets/icons/dashboard/gallery/gallery.svg",
      route: "/media" 
    },
    { 
      title: "Music", 
      iconUrl: "assets/icons/dashboard/gallery/music.svg",
      route: "/music"
    },
    { 
      title: "Books", 
      iconUrl: "assets/icons/dashboard/gallery/books.svg",
      route: "/books" 
    },
    { 
      title: "Digital Gems", 
      iconUrl: "assets/icons/dashboard/gallery/gemstone.svg",
      route: "/digital-gems"
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
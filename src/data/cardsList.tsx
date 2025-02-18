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
        'https://mosaic.scdn.co/640/ab67616d00001e0237e36bb8b1efe88f9c84200aab67616d00001e0259eaf2f9fca6f4c449fc9fc0ab67616d00001e02b2ac8e98b0fe410e0bd9fd52ab67616d00001e02d421c7b2de6846831a2c3814',
        'https://mosaic.scdn.co/640/ab67616d00001e0270622da427271b0203d7ce79ab67616d00001e0284426b19844492cccbe23876ab67616d00001e02d6be58f07b858364845c13b9ab67616d00001e02e5234dab5a91ec9e75564184',
        'https://mosaic.scdn.co/640/ab67616d00001e024564cbd2bfb31e7fab8e5e46ab67616d00001e02a3bd2d6bfae0b5cb0e9dac57ab67616d00001e02bcd8da1b2a1e5ad92dcca135ab67616d00001e02e49806ff277ac693976caa97',
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
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const products = [
      {
        name: 'ROG Strix GL702ZC',
        description: "The world's first gaming laptop featuring the AMD Ryzen™ 7 processor. Combining the sheer power of AMD's revolutionary Ryzen platform with ROG's gaming design legacy, ROG Strix GL702ZC is designed to deliver amazing performance to satisfy the needs of hard-core gamers and users with demanding, multimedia-heavy workloads. With a 17-inch, wide-view panel for incredible visuals, an anti-ghosting backlit keyboard for fast, accurate control, and ROG Gaming Center with a wealth of gamer-oriented features, ROG Strix GL702ZC is a finely tuned weapon backed by eight-core power for gaming a competitive edge.",
        CategoryId: 1,
        price: 21400000,
        stock: 6,
        imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/assets.muhammadsatriaadiputra.digital/Betafox_E-Commerce/STRIX-GL702ZC.png'
      },
      {
        name: 'ROG Zephyrus GX501',
        description: "A revolutionary gaming laptop born from ROG’s persistent dedication to innovation. Despite being thinner than all previous ROG laptops, it has the hardware to rival high-end gaming desktops: NVIDIA® GeForce® GTX 1080 graphics with Max-Q design, an 8th Gen Intel® Core™ i7 processor, a 144Hz IPS panel with an ultra-fast 3ms response time, and Windows 10 Pro. ROG slimmed the body to a mere 16.9-17.9mm while maintaining powerful cooling and unbeatable acoustic efficiency thanks to a clever new air-flow design: Active Aerodynamic System. The sleek chassis also includes an RGB keyboard that will feel familiar to gamers who typically play on desktop PCs.",
        CategoryId: 1,
        price: 48500000,
        stock: 4,
        imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/assets.muhammadsatriaadiputra.digital/Betafox_E-Commerce/ZEPHYRUS-GX501.png'
      },
      {
        name: 'Strix Hero II GL504',
        description: "With up to the latest NVIDIA® GeForce RTX™ 2060 graphics and 8th Generation Intel® Core™ i7 processors, ROG Strix Hero II brings even more power and style to MOBA esports gaming. This 15-inch Windows 10 Pro gaming laptop boasts the world’s first 144Hz super-narrow-bezel display with an ultrafast 3ms gray-to-gray (GTG) response time for visuals with unmatched smoothness and response. For an added edge in the heat of battle, the exclusive HyperCool Pro cooling system allows you to fully unleash the potential of the high-performance CPU and GPU, while ROG RangeBoost technology uses multi-antenna Wi-Fi to provide 30% more1 range, higher throughput, and fewer connection drops. In addition, the all-new Armoury Crate utility offers one-click access to system settings and Aura lighting effects. Strix Hero II offers an unstoppable combination of high-performance graphics and ultrafast display in a compact design!",
        CategoryId: 1,
        price: 24800000,
        stock: 6,
        imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/assets.muhammadsatriaadiputra.digital/Betafox_E-Commerce/STRIX-HERO-II-GL504.png'
      },
      {
        name: 'ROG GL552VX',
        description: "Maximum gaming performance, attentive design, flawless visuals and instant upgrades. ROG GL552 is ready to play. With an up to quad-core 6th-generation Intel® Core™ i7 processor and dedicated NVIDIA® GeForce® GTX™ graphics with Microsoft DirectX 12 support, ROG GL552 is made for gaming and primed for creativity. Experience any game or run any application, with the sharper visuals and superior performance you demand.",
        CategoryId: 1,
        price: 13700000,
        stock: 7,
        imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/assets.muhammadsatriaadiputra.digital/Betafox_E-Commerce/ROG-GL552VX.png'
      },
      {
        name: 'ProArt W590G6T',
        description: "The first laptop to feature NVIDIA® Quadro RTX™ 6000 graphics, and powered by the latest Intel® Core™ i9 processors, ProArt StudioBook One is the most powerful RTX Studio Laptop ever. Designed for data science, product development, and animation, it can easily handle large-scale computations and graphics-intensive applications.",
        CategoryId: 1,
        price: 49900000,
        stock: 2,
        imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/assets.muhammadsatriaadiputra.digital/Betafox_E-Commerce/PROART.png'
      },
      {
        name: 'ZenBook Pro UX580GE',
        description: "There’s never been a laptop like the all-powerful, all-conquering ZenBook Pro 15. It’s faster and more sophisticated than ever before, and the jaw-dropping new ScreenPad™ adds magic to your creativity. With ZenBook Pro 15, you don’t have to wait for the future: you can touch it, right here and right now.",
        CategoryId: 1,
        price: 33650000,
        stock: 4,
        imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/assets.muhammadsatriaadiputra.digital/Betafox_E-Commerce/ZENBOOK-UX580GE.png'
      },
      {
        name: 'VivoBook X412UF',
        description: "The new ErgoLift hinge design also tilts the keyboard up for more comfortable typing. VivoBook 14 is powered by up to the latest Intel® Core™ i7 processor with discrete NVIDIA® graphics and dual storage drives to help you get things done with the least amount of fuss. What’s more, it’s available in four unique finishes to suit your style.",
        CategoryId: 1,
        price: 14899000,
        stock: 5,
        imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/assets.muhammadsatriaadiputra.digital/Betafox_E-Commerce/VIVOBOOK+X412UF.png'
      },
      {
        name: 'Xiaomi Blackshark 2',
        description: 'Terinspirasi oleh garis halus supercar F1, Black Shark 2 Pro dirancang secara ergonomis menggunakan bahan premium, ideal untuk sesi permainan yang panjang. RGB "Shark Eyes" memiliki dua strip lampu belakang untuk memberikan pengalaman gaming yang sangat imersif.',
        CategoryId: 2,
        price: 9600000,
        stock: 12,
        imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/assets.muhammadsatriaadiputra.digital/Betafox_E-Commerce/BLACKSHARK2.png'
      },
      {
        name: 'ZenFone 6',
        description: "Combining ASUS innovation, leading-edge performance and sophisticated world-class design, the new ZenFone 6 defies ordinary. Its groundbreaking features include an all-screen NanoEdge display, the unique 48MP Flip Camera, and incredible battery life. Why choose ordinary, when there’s ZenFone 6?",
        CategoryId: 2,
        price: 6999000,
        stock: 18,
        imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/assets.muhammadsatriaadiputra.digital/Betafox_E-Commerce/ZENFONE6.png'
      }
      // {
      //   name: '',
      //   description: "",
      //   CategoryId: 1,
      //   price: ,
      //   stock: ,
      //   imageUrl: ''
      // },
      // {
      //   name: '',
      //   description: "",
      //   CategoryId: 1,
      //   price: ,
      //   stock: ,
      //   imageUrl: ''
      // }
    ]
      return queryInterface.bulkInsert('Products', products, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Products', null, {});
  }
};

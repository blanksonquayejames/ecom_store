/**
 * 7th JUNE COMPUTERS - Product Catalog Dataset
 * High-performance computer accessories, gaming peripherals, mechanical keyboards,
 * precision mice, audiophile headsets, monitor mounts, and workstation essentials.
 */

export const PRODUCTS = [
  {
    id: 'prod-001',
    name: 'ApexPro V3 Magnetic Hall-Effect Keyboard',
    tagline: 'Rapid Trigger 0.1mm Actuation & CNC Anodized Aluminum Chassis',
    category: 'Keyboards & Keycaps',
    price: 229,
    originalPrice: 269,
    rating: 4.96,
    reviewsCount: 184,
    stock: 9,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    featured: true,
    description: 'Engineered for competitive gamers and high-speed typing enthusiasts. Features custom magnetic Hall-Effect switches with adjustable 0.1mm to 4.0mm actuation, Rapid Trigger mode, gasket mounting, sound-dampening silicone foam, and per-key RGB backlighting.',
    heroImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#18181b', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Frost White', hex: '#f4f4f5', img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Space Gray Anodized', hex: '#3f3f46', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['75% Compact Layout', 'TKL 80% Layout', 'Full 100% Layout (+ $30)'],
    specs: {
      'Switch Type': 'Gateron Magnetic Jade Hall-Effect Switches',
      'Actuation Point': 'Adjustable 0.1mm - 4.0mm (0.01mm Precision)',
      'Polling Rate': '8000Hz (0.125ms Ultra-Low Latency)',
      'Chassis': 'Solid CNC 6063 Anodized Aluminum',
      'Keycaps': 'Double-shot PBT Cherry Profile',
      'Connectivity': 'Detachable Braided USB-C / 2.4GHz Wireless / BT 5.3',
      'Battery': '8000 mAh (Up to 320 hours battery life)'
    },
    features: [
      'Rapid Trigger technology for instantaneous key resets',
      'Dynamic Keystroke (DKS) assigns 4 actions to a single press',
      'Hot-swappable magnetic switch sockets',
      'Multi-layer Poron & IXPE acoustic sound dampeners'
    ],
    frequentlyBoughtTogether: ['prod-002', 'prod-006'],
    reviews: [
      {
        id: 'rev-1',
        author: 'Elena Rostova',
        rating: 5,
        date: '2 days ago',
        verified: true,
        title: 'Unbelievable Rapid Trigger speed',
        comment: 'Counter-strafing and movement in competitive games feels instantaneous. The aluminum chassis weight keeps it glued to the desk.'
      },
      {
        id: 'rev-2',
        author: 'Marcus Vance',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'The acoustic sound profile is pure bliss',
        comment: 'Deep, muted thock without any ping. Easily the best mechanical keyboard I have ever owned in a decade of PC builds.'
      }
    ]
  },
  {
    id: 'prod-002',
    name: 'ViperStrike Ultra 8K Wireless Gaming Mouse',
    tagline: '49g Ultra-lightweight Magnesium Skeleton & 8000Hz Optical Sensor',
    category: 'Mice & Precision',
    price: 149,
    originalPrice: 179,
    rating: 4.98,
    reviewsCount: 235,
    stock: 15,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    featured: true,
    description: 'Featherlight 49-gram magnesium alloy exoskeleton combined with the PAW3950 flagship optical sensor delivering 30,000 DPI, 750 IPS tracking, and true 8K wireless polling for pixel-perfect tracking accuracy.',
    heroImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Matte Stealth Black', hex: '#111827', img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Lunar Arctic White', hex: '#f9fafb', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Standard 8K Receiver Edition', 'With Magnetic Fast Charging Dock (+ $25)'],
    specs: {
      'Weight': '49 grams Ultra-light Magnesium Alloy',
      'Sensor': 'PixArt PAW3950 Optical Gaming Sensor',
      'Max DPI': '30,000 DPI (50 DPI increments)',
      'Polling Rate': '8000Hz Wireless & Wired HyperSpeed',
      'Switches': 'Omron Optical Micro Switches (100M click rating)',
      'Battery Life': 'Up to 90 hours continuous competitive gaming',
      'Feet': '100% Virgin Grade PTFE Rounded Skates'
    },
    features: [
      'Zero-debounce optical actuation eliminates accidental double-clicks',
      'Sub-0.125ms wireless latency with proprietary dongle',
      'Onboard memory for up to 5 custom DPI and LOD profiles',
      'Includes pre-cut textured grip tapes and extra glass skates'
    ],
    frequentlyBoughtTogether: ['prod-001', 'prod-006'],
    reviews: [
      {
        id: 'rev-3',
        author: 'Julian Thorne',
        rating: 5,
        date: '3 days ago',
        verified: true,
        title: 'Insanely light and perfectly balanced',
        comment: 'Moving from an 80g mouse to this feels like aiming with your bare hand. Tracking is buttery smooth on 240Hz.'
      }
    ]
  },
  {
    id: 'prod-003',
    name: 'Acoustix Commander Pro Studio Gaming Headset',
    tagline: 'Planar Magnetic Acoustic Drivers & Broadcast-Grade Detachable Mic',
    category: 'Audio & Headsets',
    price: 289,
    originalPrice: 340,
    rating: 4.92,
    reviewsCount: 142,
    stock: 11,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    featured: true,
    description: 'Audiophile planar magnetic transducers combined with dual wireless 2.4GHz / Bluetooth simultaneous streaming. Features passive memory foam acoustic isolation, reinforced aluminum sliders, and a studio broadcast condenser microphone.',
    heroImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Carbon Black & Gunmetal', hex: '#1e293b', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Silver Oak Studio', hex: '#94a3b8', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Standard Wireless Edition', 'With Desktop High-Res DAC Station (+ $60)'],
    specs: {
      'Drivers': '90mm Ultra-Thin Planar Magnetic Transducers',
      'Frequency Range': '10 Hz - 50,000 Hz Hi-Res Certified',
      'Microphone': 'Detachable 9.7mm Cardioid Broadcast Capsule',
      'Spatial Audio': 'Dolby Atmos & 3D Spatial Pinpoint Audio',
      'Battery Life': 'Up to 80 hours playback on single charge',
      'Connectivity': 'Ultra-low Latency 2.4GHz, Bluetooth 5.3, 3.5mm AUX'
    },
    features: [
      'Simultaneous dual-audio Bluetooth phone call & PC gaming audio',
      'Breathable cooling-gel memory foam ear cushions',
      'Hardware chat/game mix volume wheel on ear cup'
    ],
    frequentlyBoughtTogether: ['prod-007', 'prod-001'],
    reviews: [
      {
        id: 'rev-4',
        author: 'Liam Gallagher',
        rating: 5,
        date: '5 days ago',
        verified: true,
        title: 'Unmatched soundstage in FPS games',
        comment: 'Footsteps and directional audio are pin-sharp. The planar magnetic clarity blows ordinary gaming headsets away.'
      }
    ]
  },
  {
    id: 'prod-004',
    name: 'TitanFlex Dual Monitor Gas Spring Arm',
    tagline: 'Heavy-Duty Aerospace Aluminum & Quick-Release VESA 75/100 Mount',
    category: 'Monitors & Mounts',
    price: 165,
    originalPrice: 199,
    rating: 4.91,
    reviewsCount: 88,
    stock: 14,
    isNew: false,
    isTrending: false,
    isBestSeller: false,
    featured: false,
    description: 'Precision mechanical gas spring counter-balance monitor mount designed for displays up to 35 inches and 12kg each. Features integrated concealed cable channels, 360-degree rotation, 90-degree swivel, and dual clamp/grommet desk installation.',
    heroImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Matte Stealth Black', hex: '#1e293b', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Brushed Silver Aluminum', hex: '#cbd5e1', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Dual Arm Setup', 'Single Heavy-Duty Ultrawide Arm (- $30)'],
    specs: {
      'Screen Size Compatibility': '17" to 35" per arm (Flat & Curved)',
      'Weight Capacity': 'Up to 12 kg (26.5 lbs) per monitor arm',
      'VESA Standards': '75x75mm and 100x100mm Quick-Release Plates',
      'Tilt Range': '+90° to -45° vertical angle adjustment',
      'Swivel & Rotation': '180° swivel, 360° portrait/landscape rotation',
      'Desk Thickness': 'Clamp: 10-85mm / Grommet: 10-80mm'
    },
    features: [
      'Integrated high-capacity cable routing tracks hide all wires',
      'Quick-release VESA bracket allows effortless one-person mounting'
    ],
    frequentlyBoughtTogether: ['prod-010', 'prod-006'],
    reviews: [
      {
        id: 'rev-5',
        author: 'Christian Bauer',
        rating: 5,
        date: '2 weeks ago',
        verified: true,
        title: 'Holds two 32-inch monitors rock solid',
        comment: 'Zero wobbling when typing. Completely cleared up my desk space and looks ultra-clean.'
      }
    ]
  },
  {
    id: 'prod-005',
    name: 'ThunderDock 16-in-1 Dual 4K Thunderbolt 4 Hub',
    tagline: '40Gbps Transfer Speeds, 100W PD Host Charging & 2.5GbE LAN',
    category: 'Hubs & Docks',
    price: 249,
    originalPrice: 299,
    rating: 4.95,
    reviewsCount: 116,
    stock: 8,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    featured: false,
    description: 'Transform your laptop or desktop into a full workstation. Features dual 4K 144Hz or single 8K 60Hz display output, 100W power delivery, UHS-II SD 4.0 card reader, 2.5 Gigabit Ethernet, and quad 10Gbps USB-A/USB-C ports.',
    heroImage: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Space Gray Machined', hex: '#334155', img: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Standard Dock Package', 'With 2m 40Gbps Certified Cable Bundle (+ $20)'],
    specs: {
      'Chipset': 'Intel Goshen Ridge Thunderbolt 4 JHL8440 Controller',
      'Speed': 'Up to 40Gbps Total Bidirectional Bandwidth',
      'Display Outputs': '2x DisplayPort 1.4, 2x HDMI 2.1 (Dual 4K @ 144Hz)',
      'Power Delivery': '100W Dynamic Smart Power Delivery to Host',
      'Network': '2.5 Gbps Realtek High-Speed Ethernet',
      'Audio': '3.5mm Hi-Fi Combo Headphone/Mic Jack'
    },
    features: [
      'Fanless aluminum chassis dissipates heat quietly and efficiently',
      'Compatible with Windows 10/11, macOS, and Linux'
    ],
    frequentlyBoughtTogether: ['prod-004', 'prod-011'],
    reviews: [
      {
        id: 'rev-6',
        author: 'Alexandre DuPont',
        rating: 5,
        date: '4 days ago',
        verified: true,
        title: 'Single-cable perfection for my workstation',
        comment: 'Powers my dual displays, peripherals, and charges my machine with zero latency or dropped connections.'
      }
    ]
  },
  {
    id: 'prod-006',
    name: 'HyperGlide Cordura XXL Gaming Desk Mat',
    tagline: 'Water-Repellent Military Cordura Fabric & Anti-Fray Stitched Edges',
    category: 'Desk Setup & Mats',
    price: 49,
    originalPrice: 65,
    rating: 4.88,
    reviewsCount: 310,
    stock: 28,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    featured: false,
    description: 'Crafted from authentic Cordura 500D ballistic nylon fabric. Resists spills, sweat, and wear while providing the perfect balance of low dynamic friction and stopping power for high-precision competitive aiming.',
    heroImage: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Stealth Black', hex: '#0f172a', img: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Topographic Minimalist', hex: '#475569', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['XL (900 x 400 x 4mm)', 'XXL Extended (1200 x 600 x 4mm + $15)'],
    specs: {
      'Surface Material': 'Genuine Cordura 500D High-Tenacity Fabric',
      'Base Material': 'Anti-Slip Natural Textured Cellular Rubber Base',
      'Stitching': 'Sub-surface micro-knit anti-fray stitched perimeter',
      'Thickness': '4.0mm High-Density Cushioning'
    },
    features: [
      'Hydrophobic coating causes liquids to bead up for instant wipe-off',
      'Smooth glide consistency across all ambient humidity levels'
    ],
    frequentlyBoughtTogether: ['prod-001', 'prod-002'],
    reviews: [
      {
        id: 'rev-7',
        author: 'Hannah Kim',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'Spill-proof and stays perfectly flat',
        comment: 'Coffee spilled right on it and wiped clean without a trace. Mouse sensor tracking is flawless.'
      }
    ]
  },
  {
    id: 'prod-007',
    name: 'StreamCast Studio USB-C Condenser Microphone',
    tagline: '192kHz/24-Bit Studio Cardioid Mic with Integrated Shock Mount & Gain Dial',
    category: 'Audio & Headsets',
    price: 139,
    originalPrice: 169,
    rating: 4.93,
    reviewsCount: 168,
    stock: 12,
    isNew: true,
    isTrending: false,
    isBestSeller: false,
    featured: false,
    description: 'Broadcast studio quality sound without complex audio interfaces. Houses a 25mm gold-sputtered condenser capsule, touch-to-mute capacitive sensor with LED status, zero-latency 3.5mm monitor jack, and hardware noise gate.',
    heroImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Matte Obsidian Black', hex: '#18181b', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Desk Stand Edition', 'With Heavy-Duty Boom Arm & Pop Filter (+ $35)'],
    specs: {
      'Capsule': '25mm Gold-Sputtered Condenser Transducer',
      'Polar Pattern': 'Cardioid Directional Pickup (Rejects desk typing noise)',
      'Sample Rate / Resolution': '192kHz / 24-bit Studio Master Grade',
      'Frequency Response': '20 Hz - 20,000 Hz',
      'Controls': 'Touch Mute, Analog Gain Dial, Headphone Volume Dial'
    },
    features: [
      'Internal dual-layer pop filter and vibration-decoupling shock mount',
      'Plug-and-play USB-C connectivity with zero driver install required'
    ],
    frequentlyBoughtTogether: ['prod-003', 'prod-005'],
    reviews: [
      {
        id: 'rev-8',
        author: 'Dr. Arthur Sterling',
        rating: 5,
        date: '3 weeks ago',
        verified: true,
        title: 'Radio broadcast clarity right on USB',
        comment: 'Deep, rich vocal tone for streaming and Discord calls. The tap-to-mute sensor is very responsive.'
      }
    ]
  },
  {
    id: 'prod-008',
    name: 'Custom PBT Dye-Sub Keycap Set (Cyberpunk Edition)',
    tagline: 'Cherry Profile 1.5mm Ultra-Thick PBT with Universal ANSI/ISO Support',
    category: 'Keyboards & Keycaps',
    price: 79,
    originalPrice: 95,
    rating: 4.90,
    reviewsCount: 147,
    stock: 20,
    isNew: false,
    isTrending: true,
    isBestSeller: false,
    featured: false,
    description: '142-key universal keycap set molded from premium 1.5mm textured PBT plastic with permanent dye-sublimated legends. Resists shine, grease, and fading over years of heavy gaming sessions.',
    heroImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Cyberpunk Neon', hex: '#6366f1', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Classic Dolch Slate', hex: '#334155', img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['142-Key Base Kit', 'Base Kit + Novelty Spacebar Accents (+ $15)'],
    specs: {
      'Material': '1.5mm Extra-Thick Premium PBT (Polybutylene Terephthalate)',
      'Profile': 'Ergonomic Sculpted Cherry Profile',
      'Printing Method': 'Five-Sided Dye-Sublimation Legends',
      'Layout Support': '60%, 65%, 75%, TKL, 96%, Full Size ANSI & ISO UK/EU'
    },
    features: [
      'Matte micro-textured finish prevents finger slippage and oil buildup',
      'Includes wire keycap puller and extra novelty keycaps'
    ],
    frequentlyBoughtTogether: ['prod-001'],
    reviews: [
      {
        id: 'rev-9',
        author: 'Sophie L.',
        rating: 5,
        date: '6 days ago',
        verified: true,
        title: 'Colors pop and the feel is velvety smooth',
        comment: 'Thick keycaps completely deepened the sound profile of my mechanical keyboard.'
      }
    ]
  },
  {
    id: 'prod-009',
    name: 'ErgoVertical Wireless Precision Ergonomic Mouse',
    tagline: '57-Degree Natural Handshake Angle & Dual-Mode Silent Click Switches',
    category: 'Mice & Precision',
    price: 89,
    originalPrice: 110,
    rating: 4.87,
    reviewsCount: 92,
    stock: 17,
    isNew: false,
    isTrending: false,
    isBestSeller: false,
    featured: false,
    description: 'Scientifically validated ergonomic design aligns forearm posture at a 57-degree natural angle, reducing wrist pressure and muscular strain by up to 40%. Features ultra-quiet tactile clicks, smooth thumb rest, and 4000 DPI sensor.',
    heroImage: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Graphite Black', hex: '#1e293b', img: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Standard Right-Handed', 'Left-Handed Edition'],
    specs: {
      'Posture Angle': '57° Natural Ergonomic Handshake Alignment',
      'Sensor': 'Darkfield High-Precision Optical Sensor (400-4000 DPI)',
      'Switches': '90% Noise-Reduced Silent Micro Switches',
      'Connectivity': '2.4GHz USB Receiver + Bluetooth Multi-Device (3 devices)',
      'Battery': 'Rechargeable 500mAh (Up to 4 months per charge)'
    },
    features: [
      'Easy-Switch button allows toggling between laptop, desktop, and tablet',
      'Textured rubber grip surface ensures effortless thumb comfort'
    ],
    frequentlyBoughtTogether: ['prod-006', 'prod-001'],
    reviews: [
      {
        id: 'rev-10',
        author: 'Siddharth M.',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'Cured my wrist pain completely',
        comment: 'Working 9 hours a day coding without any forearm strain now. Silent clicks are wonderful in office environments.'
      }
    ]
  },
  {
    id: 'prod-010',
    name: 'LuminaBar ScreenBar Plus Monitor Light',
    tagline: 'Asymmetric Optical Glare-Free Workspace Lightbar with Desktop Puck',
    category: 'Monitors & Mounts',
    price: 119,
    originalPrice: 145,
    rating: 4.94,
    reviewsCount: 160,
    stock: 13,
    isNew: false,
    isTrending: false,
    isBestSeller: false,
    featured: false,
    description: 'Patented asymmetric optical illumination lights up your desktop workspace without causing any glare or reflection on your computer monitor screen. Features a rotary desktop wireless control dial and auto-ambient light sensor.',
    heroImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Space Black Machined', hex: '#1e293b', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Standard Flat Monitor Model', 'Curved Monitor Adapter Kit (+ $15)'],
    specs: {
      'Optics': 'Asymmetric 45° Glare-Free Optical Design',
      'Color Temperature': 'Adjustable 2700K (Warm Glow) to 6500K (Cool White)',
      'Color Rendering': 'Ra > 97 Ultra-High Natural Sunlight CRI',
      'Controls': 'Wireless Desktop Rotary Controller (Brightness & CCT)',
      'Power': 'USB-C 5V/2A powered directly from computer or monitor'
    },
    features: [
      'Weighted counterweight clip mounts to any monitor bezel without tape',
      'Saves 100% of valuable desktop surface real estate'
    ],
    frequentlyBoughtTogether: ['prod-004', 'prod-006'],
    reviews: [
      {
        id: 'rev-11',
        author: 'Daisuke K.',
        rating: 5,
        date: '2 weeks ago',
        verified: true,
        title: 'Relieves eye fatigue during late night sessions',
        comment: 'Zero screen reflection. The wireless dial on the desk makes adjusting warmth super satisfying.'
      }
    ]
  },
  {
    id: 'prod-011',
    name: 'PCIe 4.0 NVMe M.2 USB4 40Gbps External Enclosure',
    tagline: '40Gbps Transfer Speeds (3800MB/s) with Active Silent Micro-Fan Heatsink',
    category: 'Hubs & Docks',
    price: 75,
    originalPrice: 95,
    rating: 4.89,
    reviewsCount: 104,
    stock: 22,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    featured: false,
    description: 'Achieve blistering 3800 MB/s real-world read and write speeds with your M.2 NVMe SSD. Machined from solid aircraft-grade aluminum alloy with thermal silicone pad and an intelligent quiet PWM cooling fan that prevents thermal throttling.',
    heroImage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Gunmetal Gray', hex: '#334155', img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Enclosure Only', 'Bundled with 1TB PCIe 4.0 NVMe (+ $80)', 'Bundled with 2TB PCIe 4.0 NVMe (+ $145)'],
    specs: {
      'Interface': 'USB4 / Thunderbolt 4 & 3 (40Gbps Protocol)',
      'Max Speed': 'Up to 3,800 MB/s Sequential Read / Write',
      'Drive Support': 'M.2 NVMe PCIe M-Key / B&M Key (Sizes 2280, 2260, 2242, 2230)',
      'Cooling': 'Dual-layer aluminum fins + Active PWM silent turbo fan'
    },
    features: [
      'Tool-free toolless sliding lock design for quick drive swaps',
      'Includes 40Gbps braided USB-C to USB-C cable with E-Marker chip'
    ],
    frequentlyBoughtTogether: ['prod-005'],
    reviews: [
      {
        id: 'rev-12',
        author: 'Rania Al-Mansoor',
        rating: 5,
        date: '4 days ago',
        verified: true,
        title: 'Transfers 100GB 4K video footage in 30 seconds',
        comment: 'Never gets hot even during sustained file transfers. The fan is whisper quiet.'
      }
    ]
  },
  {
    id: 'prod-012',
    name: 'StreamKey 15-Key Macro & Stream Controller',
    tagline: 'Customizable LCD Keys with Dynamic Visual Shortcuts & OBS / Discord Integration',
    category: 'Desk Setup & Mats',
    price: 149,
    originalPrice: 175,
    rating: 4.93,
    reviewsCount: 152,
    stock: 10,
    isNew: true,
    isTrending: false,
    isBestSeller: false,
    featured: false,
    description: '15 customizable full-color LCD key icons to launch apps, mute audio channels, trigger macro scripts, adjust smart lighting, and control live streams with visual confirmation at the touch of a button.',
    heroImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Midnight Black', hex: '#0f172a', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['15-Key Deck', '32-Key XL Deck (+ $95)'],
    specs: {
      'Keys': '15 Programmable Full-Color Transparent LCD Display Keys',
      'Interface': 'Detachable Braided USB-C Cable (1.5m)',
      'Stand': 'Magnetic 45° Angled Non-Slip Aluminum Desktop Stand',
      'Integration': 'OBS Studio, Twitch, Discord, Spotify, Premiere Pro, Photoshop, Blender'
    },
    features: [
      'Folders feature unlocks infinite custom actions and sub-menus',
      'Drag-and-drop icon store with thousands of animated icons and plugins'
    ],
    frequentlyBoughtTogether: ['prod-007', 'prod-001'],
    reviews: [
      {
        id: 'rev-13',
        author: 'Kenji Sato',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'Massive productivity booster for coding & editing',
        comment: 'I mapped all my VS Code terminal tasks, git commits, and music controls. Cannot work without it now.'
      }
    ]
  },
  {
    id: 'prod-013',
    name: 'Apple MacBook Pro 16" M3 Max Liquid Retina XDR',
    tagline: '16-Core CPU, 40-Core GPU, 48GB Unified RAM & 1TB NVMe Storage',
    category: 'Laptops & Workstations',
    price: 3499,
    originalPrice: 3899,
    rating: 4.99,
    reviewsCount: 312,
    stock: 7,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    featured: true,
    description: 'The ultimate powerhouse for software engineers, 3D artists, and creative pros. Equipped with Apple M3 Max silicon, extreme dynamic range 120Hz ProMotion display with 1600 nits peak brightness, studio-grade 6-speaker sound system with spatial audio, and up to 22 hours of battery life.',
    heroImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Space Black Anodized', hex: '#1c1c1e', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Silver Machined Aluminum', hex: '#e2e8f0', img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['48GB RAM / 1TB SSD', '64GB RAM / 2TB SSD (+ $500)', '128GB RAM / 4TB SSD (+ $1400)'],
    specs: {
      'Processor': 'Apple M3 Max (16-Core CPU with 12 performance cores)',
      'Graphics': '40-Core GPU with Hardware Ray Tracing',
      'Display': '16.2" Liquid Retina XDR (3456x2234, 120Hz ProMotion)',
      'Memory': '48GB Unified High-Bandwidth Memory (400GB/s)',
      'Storage': '1TB Ultra-Fast NVMe SSD (Up to 7.4GB/s read)',
      'Ports': '3x Thunderbolt 4 / USB 4, HDMI 2.1, SDXC Slot, MagSafe 3',
      'Battery': '100Wh Lithium-Polymer (Up to 22 Hours Web/Video)'
    },
    features: [
      'Hardware-accelerated ray tracing and dynamic caching architecture',
      'Anti-reflective nano-texture display coating option',
      'Magic Keyboard with Touch ID and Force Touch trackpad'
    ],
    frequentlyBoughtTogether: ['prod-005', 'prod-002'],
    reviews: [
      {
        id: 'rev-14',
        author: 'Julian Vance',
        rating: 5,
        date: '1 day ago',
        verified: true,
        title: 'Insane compiling speeds and battery life',
        comment: 'Docker containers, Xcode builds, and video exports finish in seconds without even spinning the fans audibly.'
      }
    ]
  },
  {
    id: 'prod-014',
    name: 'Titan X Custom Liquid-Cooled Gaming Rig',
    tagline: 'AMD Ryzen 9 7950X3D & NVIDIA RTX 4090 24GB with Hardline EKWB Loop',
    category: 'Gaming PCs & Towers',
    price: 4299,
    originalPrice: 4799,
    rating: 4.98,
    reviewsCount: 178,
    stock: 4,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    featured: true,
    description: 'Mastercraft custom desktop engineered by 7th June PC technicians. Features hand-bent acrylic hardline watercooling, dual 360mm copper radiators, AMD 3D V-Cache flagship processor, RTX 4090 with active backplate cooling, and Lian Li O11 Dynamic EVO RGB chassis.',
    heroImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Crystal Stealth Black', hex: '#0f172a', img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Arctic Glacier White', hex: '#f8fafc', img: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['64GB DDR5 / 2TB Gen5 SSD', '128GB DDR5 / 4TB Gen5 SSD (+ $650)'],
    specs: {
      'CPU': 'AMD Ryzen 9 7950X3D (16 Cores, 32 Threads, 144MB 3D V-Cache)',
      'GPU': 'NVIDIA GeForce RTX 4090 24GB GDDR6X Liquid Cooled',
      'Motherboard': 'ASUS ROG Crosshair X670E Hero WiFi 6E',
      'RAM': '64GB G.Skill Trident Z5 RGB DDR5-6000MHz CL30',
      'Storage': '2TB Samsung 990 PRO PCIe 4.0 NVMe (7,450 MB/s)',
      'Cooling': 'Custom EK-Quantum Vector² Hardline Loop + 2x 360mm Rads',
      'PSU': 'Seasonic Prime TX-1300W 80+ Titanium ATX 3.0'
    },
    features: [
      'Stress-tested 48-hour burn-in with certified stability benchmarks',
      'Sub-50°C temperatures under full 4K ultra ray-traced workloads',
      'Custom sleeved braided cables in gold/carbon accents'
    ],
    frequentlyBoughtTogether: ['prod-001', 'prod-002'],
    reviews: [
      {
        id: 'rev-15',
        author: 'Alexander Drake',
        rating: 5,
        date: '4 days ago',
        verified: true,
        title: 'A true work of computing art',
        comment: 'Runs Cyberpunk 2077 at 4K Path Tracing with zero drops. The hardline tubing bends are immaculate.'
      }
    ]
  },
  {
    id: 'prod-015',
    name: 'ASUS ROG Zephyrus G16 OLED Gaming Laptop',
    tagline: 'Intel Core Ultra 9, RTX 4090 16GB, 240Hz 0.2ms ROG Nebula OLED',
    category: 'Laptops & Workstations',
    price: 2799,
    originalPrice: 3099,
    rating: 4.94,
    reviewsCount: 195,
    stock: 9,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    featured: false,
    description: 'Ultra-slim CNC aluminum gaming laptop weighing just 1.85kg. Features the stunning 2.5K 240Hz ROG Nebula OLED display with G-SYNC, Slash Lighting LED matrix lid, Tri-Fan cooling with vapor chamber, and 100W USB-C fast charging.',
    heroImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Eclipse Gray CNC', hex: '#262626', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Platinum White CNC', hex: '#f5f5f5', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['32GB LPDDR5X / 1TB SSD', '64GB LPDDR5X / 2TB SSD (+ $350)'],
    specs: {
      'CPU': 'Intel Core Ultra 9 185H (16 Cores, Intel AI Boost NPU)',
      'GPU': 'NVIDIA GeForce RTX 4090 Laptop GPU 16GB GDDR6',
      'Display': '16.0" 2.5K (2560x1600) 240Hz 0.2ms ROG Nebula OLED',
      'RAM': '32GB LPDDR5X-7467MHz Dual Channel',
      'Storage': '1TB PCIe 4.0 NVMe SSD + Extra M.2 slot',
      'Weight': '1.85 kg (4.07 lbs) Ultra-Portable CNC Unibody',
      'Battery': '90Wh with 100W Type-C Power Delivery'
    },
    features: [
      'Slash Lighting customizable diagonal matrix on aluminum lid',
      '0dB Ambient Silent Cooling for quiet productivity workloads',
      'Dolby Atmos 6-speaker sound system with dual force-canceling woofers'
    ],
    frequentlyBoughtTogether: ['prod-002', 'prod-003'],
    reviews: [
      {
        id: 'rev-16',
        author: 'Sarah Chen',
        rating: 5,
        date: '6 days ago',
        verified: true,
        title: 'The OLED screen is jaw-dropping',
        comment: 'Pure inky blacks and infinite contrast. It looks like a sleek ultrabook but games like a full desktop.'
      }
    ]
  },
  {
    id: 'prod-016',
    name: 'Dell XPS 16 InfinityEdge 4K+ OLED Workstation',
    tagline: 'Intel Core Ultra 7, RTX 4070, Seamless Glass Touchpad & CNC Aluminum',
    category: 'Laptops & Workstations',
    price: 2499,
    originalPrice: 2849,
    rating: 4.93,
    reviewsCount: 138,
    stock: 8,
    isNew: false,
    isTrending: false,
    isBestSeller: false,
    featured: false,
    description: 'Iconic minimalist design engineered from CNC machined aluminum and Gorilla Glass 3. Featuring the zero-lattice keyboard, capacitive touch function row, seamless haptic glass touchpad, and 4K+ InfinityEdge OLED touch panel with 100% DCI-P3 color reproduction.',
    heroImage: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Platinum Silver Aluminum', hex: '#d1d5db', img: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Graphite Anodized', hex: '#374151', img: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['32GB LPDDR5X / 1TB SSD', '64GB LPDDR5X / 2TB SSD (+ $400)'],
    specs: {
      'CPU': 'Intel Core Ultra 7 155H (16 Cores, 22 Threads up to 4.8GHz)',
      'GPU': 'NVIDIA GeForce RTX 4070 8GB GDDR6 (60W TGP)',
      'Display': '16.3" 4K+ (3840x2400) InfinityEdge OLED Touch (400 nits)',
      'RAM': '32GB LPDDR5X 7467MHz Dual-Channel',
      'Storage': '1TB M.2 PCIe NVMe Solid State Drive',
      'Chassis': 'CNC Machined Aluminum with Tone-on-Tone Glass Palm Rest',
      'Connectivity': '3x Thunderbolt 4 with Power Delivery & DisplayPort, MicroSD'
    },
    features: [
      'Seamless integrated glass haptic touchpad with precise haptic feedback',
      'Zero-lattice keyboard with larger keycaps and 1mm key travel',
      'Quad-speaker design with Waves Nx 3D Audio'
    ],
    frequentlyBoughtTogether: ['prod-005', 'prod-006'],
    reviews: [
      {
        id: 'rev-17',
        author: 'Kwame Mensah',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'Stunning industrial design and build quality',
        comment: 'The touch panel and keyboard feel futuristic. Perfect for my engineering work and software design.'
      }
    ]
  }
];

export const CATEGORIES = [
  'All Products',
  'Laptops & Workstations',
  'Gaming PCs & Towers',
  'Keyboards & Keycaps',
  'Mice & Precision',
  'Audio & Headsets',
  'Monitors & Mounts',
  'Desk Setup & Mats',
  'Hubs & Docks'
];

export const PROMO_CODES = {
  'SAVE20': { discountPercent: 20, description: '20% Off Storewide' },
  'LUXE15': { discountPercent: 15, description: '15% VIP Peripheral Discount' },
  'FREESHIP': { freeShipping: true, description: 'Free Express Computer Accessories Shipping' }
};

export const RECENT_SALES_NOTIFICATIONS = [
  { user: 'Marcus from London', item: 'ApexPro V3 Magnetic Hall-Effect Keyboard', time: '2 mins ago' },
  { user: 'Kenji from Tokyo', item: 'ViperStrike Ultra 8K Wireless Gaming Mouse', time: '5 mins ago' },
  { user: 'Elena from Berlin', item: 'Acoustix Commander Pro Studio Gaming Headset', time: '11 mins ago' },
  { user: 'Alexander from Zurich', item: 'ThunderDock 16-in-1 Dual 4K Thunderbolt 4 Hub', time: '14 mins ago' },
  { user: 'Maya from New York', item: 'TitanFlex Dual Monitor Gas Spring Arm', time: '18 mins ago' }
];

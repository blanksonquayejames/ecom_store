/**
 * AURA LUXE - Product Catalog Dataset
 * High-definition luxury tech, audio, optics, and designer essentials.
 */

export const PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Aura Horizon Spatial Vision Glass',
    tagline: 'Dual 8K Micro-OLED Spatial Computing & Optical Glass',
    category: 'Spatial Optics',
    price: 1899,
    originalPrice: 2299,
    rating: 4.95,
    reviewsCount: 142,
    stock: 7,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    featured: true,
    description: 'Experience pure spatial reality with ultra-dense 8K Micro-OLED displays, custom photonics, and aerospace-grade titanium chassis. Seamlessly blends high-precision augmented workspace with cinema-grade spatial immersion.',
    heroImage: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1576793132646-60787e742880?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Titanium Graphite', hex: '#2b2d30', img: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Lunar Silver', hex: '#d1d5db', img: 'https://images.unsplash.com/photo-1576793132646-60787e742880?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Champagne Gold', hex: '#d4af37', img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['256 GB', '512 GB', '1 TB'],
    specs: {
      'Display': 'Dual 8K Micro-OLED (3840 x 3550 per eye)',
      'Refresh Rate': '120Hz Low Latency HDR',
      'Processor': 'Aura Quantum Neural SoC M4',
      'Weight': '248 grams Ultra-light Titanium',
      'Battery Life': 'Up to 5.5 hours active tetherless use',
      'Audio': 'Binaural Ray-traced Spatial Acoustic Transducers',
      'Connectivity': 'Wi-Fi 7, Ultra-Wideband, Bluetooth 5.4'
    },
    features: [
      'Zero-Latency True HDR Optical Passthrough',
      'Sub-Millimeter Eye & Hand Gesture Tracking',
      'Custom Prescription Magnetic Optical Inserts',
      'Active Liquid-Vapor Thermal Dissipation'
    ],
    frequentlyBoughtTogether: ['prod-002', 'prod-006'],
    reviews: [
      {
        id: 'rev-1',
        author: 'Elena Rostova',
        rating: 5,
        date: '2 days ago',
        verified: true,
        title: 'Unprecedented optical clarity',
        comment: 'The 8K micro-OLED is astonishing. Replaced my triple-monitor studio desk setup in day one. The craftsmanship is pure luxury.'
      },
      {
        id: 'rev-2',
        author: 'Marcus Vance',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'Worth every dollar for design professionals',
        comment: 'Tetherless freedom with spatial tracking that feels like science fiction made reality.'
      }
    ]
  },
  {
    id: 'prod-002',
    name: 'Acoustics Apex Master Planar Headphones',
    tagline: 'Open-Back Audiophile Planar Magnetic Studio Monitors',
    category: 'Audio & Sound',
    price: 980,
    originalPrice: 1150,
    rating: 4.98,
    reviewsCount: 219,
    stock: 12,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    featured: true,
    description: 'Forged from aircraft-grade aluminum, hand-finished walnut wood enclosures, and 100mm nano-scale planar drivers delivering harmonic clarity from 5Hz to 55kHz with zero distortion.',
    heroImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Walnut & Matte Black', hex: '#1c1917', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Silver Oak', hex: '#a8a29e', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Standard 3.5mm Cable', 'Balanced 4.4mm Pentaconn + XLR'],
    specs: {
      'Transducer Type': '100mm Ultra-Thin Planar Magnetic',
      'Frequency Response': '5 Hz - 55,000 Hz',
      'Total Harmonic Distortion': '< 0.03% at 1kHz, 100dB SPL',
      'Impedance': '32 Ohms (Easy to drive)',
      'Ear Cushions': 'Italian Perforated Lambskin & Memory Foam',
      'Cable': 'Silver-Plated Monocrystalline Copper Cable (2.5m)'
    },
    features: [
      'Ultra-low mass nano-scale planar diaphragm',
      'Acoustic Waveguide for laser-accurate imaging',
      'Zero-fatigue suspension headband with CNC alloy sliders',
      'Handcrafted luxury presentation hard case'
    ],
    frequentlyBoughtTogether: ['prod-007', 'prod-004'],
    reviews: [
      {
        id: 'rev-3',
        author: 'Julian Thorne',
        rating: 5,
        date: '3 days ago',
        verified: true,
        title: 'Reference standard soundstage',
        comment: 'Bass is tight and deep, midrange vocals sound like the singer is in the room with you. Magnificent build.'
      }
    ]
  },
  {
    id: 'prod-003',
    name: 'Chronos Cybernetic Titanium Smartwatch',
    tagline: 'Sapphire Crystal & DLC Titanium Health Chronograph',
    category: 'Wearables',
    price: 749,
    originalPrice: 899,
    rating: 4.88,
    reviewsCount: 98,
    stock: 15,
    isNew: true,
    isTrending: false,
    isBestSeller: true,
    featured: true,
    description: 'Precision Swiss horological craftsmanship meets next-gen bio-sensing. Featuring Grade-5 DLC titanium, convex sapphire glass, ECG monitoring, arterial oxygen tracking, and a 14-day battery reserve.',
    heroImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'DLC Midnight Obsidian', hex: '#18181b', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Brushed Raw Titanium', hex: '#71717a', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Rose Gold Bezel', hex: '#b76e79', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['42mm Case', '46mm Case'],
    specs: {
      'Case Material': 'Aerospace Grade-5 DLC Titanium',
      'Glass': 'Convex Anti-Reflective Sapphire Crystal',
      'Display': '1.43" LTPO AMOLED 2000 nits Always-On',
      'Water Resistance': '10 ATM (100 meters diving rated)',
      'Sensors': 'Optical PPG, ECG, Skin Temp, Dual-Freq GPS',
      'Battery': 'Up to 14 days normal use / 40h GPS tracking'
    },
    features: [
      'Continuous Medical-Grade ECG & HRV Readiness Score',
      'Custom Horology Watch Faces by Independent Watchmakers',
      'Emergency Satellite SOS Uplink Support',
      'Wireless Magnetic Qi Fast Charging Stand included'
    ],
    frequentlyBoughtTogether: ['prod-008', 'prod-005'],
    reviews: [
      {
        id: 'rev-4',
        author: 'Siddharth M.',
        rating: 5,
        date: '5 days ago',
        verified: true,
        title: 'Feels like a $5,000 Swiss timepiece',
        comment: 'The weight, the titanium finish, and the battery life blows competitors out of the water.'
      }
    ]
  },
  {
    id: 'prod-004',
    name: 'Luminary Monolith Hi-Fi Wireless Soundbar',
    tagline: 'Dolby Atmos 9.1.4 Channel Architectural Sound System',
    category: 'Audio & Sound',
    price: 1450,
    originalPrice: 1690,
    rating: 4.92,
    reviewsCount: 86,
    stock: 5,
    isNew: false,
    isTrending: true,
    isBestSeller: false,
    featured: false,
    description: 'An architectural statement piece machined from a single block of anodized aluminum. Houses 15 discrete high-output drivers with up-firing Atmos height channels and room-calibrating acoustic radar.',
    heroImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Graphite Anodized', hex: '#27272a', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Sandstone White', hex: '#e7e5e4', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Solo Monolith', 'With Subwoofer Array (+ $490)'],
    specs: {
      'Channels': '9.1.4 Dolby Atmos & DTS:X Discrete Audio',
      'Total Output Power': '850 Watts Peak Power Output',
      'Inputs': 'HDMI eARC 2.1, Optical TOSLINK, AirPlay 2, Spotify Connect',
      'Chassis': 'Solid Extruded Anodized Aluminum with Kvadrat Fabric Grille',
      'Dimensions': '112cm x 9.5cm x 14cm',
      'Weight': '11.8 kg'
    },
    features: [
      'RoomSense 3D Acoustic Environment Calibration',
      'True Wireless Lossless 24-bit/192kHz Multi-room Streaming',
      'Touch-sensitive illuminated top controls with proximity wake'
    ],
    frequentlyBoughtTogether: ['prod-007'],
    reviews: [
      {
        id: 'rev-5',
        author: 'Christian Bauer',
        rating: 5,
        date: '2 weeks ago',
        verified: true,
        title: 'Cinematic theater in the living room',
        comment: 'The ceiling bounces sound with pinpoint accuracy. Looks like a sculptural artwork on the wall.'
      }
    ]
  },
  {
    id: 'prod-005',
    name: 'Aether Key Mechanical Studio Keyboard',
    tagline: 'Gasket-Mounted Solid Brass & CNC Frosted Polycarbonate',
    category: 'Smart Living',
    price: 389,
    originalPrice: 450,
    rating: 4.97,
    reviewsCount: 312,
    stock: 18,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    featured: false,
    description: 'Designed for elite writers and programmers. Double-gasket leaf spring mounting, custom hand-lubed linear switches, solid mirror-polished PVD brass weight, and seamless tri-mode wireless connectivity.',
    heroImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Frosted Smoke & Brass', hex: '#3f3f46', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Ceramic White & Gold', hex: '#f4f4f5', img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Aura Cream Linear Switches (45g)', 'Aura Tactile Jade Switches (55g)'],
    specs: {
      'Layout': '75% Compact with CNC Rotary Knob',
      'Mounting': 'Leaf-Spring Gasket Mount with Poron Dampeners',
      'Weight': '2.15 kg Solid Desk Stability',
      'Keycaps': 'Double-shot PBT Cherry Profile',
      'Battery': '8000 mAh (up to 300 hours non-backlit)'
    },
    features: [
      'Deep acoustic "thock" sound profile without hollow resonance',
      'Hot-swappable 5-pin PCB with South-Facing RGB LEDs',
      'QMK / VIA open programmable keymaps'
    ],
    frequentlyBoughtTogether: ['prod-006', 'prod-008'],
    reviews: [
      {
        id: 'rev-6',
        author: 'Alexandre DuPont',
        rating: 5,
        date: '4 days ago',
        verified: true,
        title: 'The typing feel is unmatched',
        comment: 'Pure pleasure to write code on for 10 hours a day. The brass acoustics are sublime.'
      }
    ]
  },
  {
    id: 'prod-006',
    name: 'Solace Desk Mat & MagSafe Fast Charging Pad',
    tagline: 'Full-Grain Tuscan Vegetable-Tanned Leather & 15W Qi2 Pad',
    category: 'Smart Living',
    price: 185,
    originalPrice: 220,
    rating: 4.85,
    reviewsCount: 77,
    stock: 24,
    isNew: false,
    isTrending: false,
    isBestSeller: false,
    featured: false,
    description: 'Artisanal Italian leather handcrafted with micro-felt wool backing. Integrated dual Qi2 fast magnetic charging zones for simultaneous iPhone/Android and wireless earbuds powering.',
    heroImage: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Saddle Tan', hex: '#9a3412', img: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Stealth Matte Black', hex: '#18181b', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Medium (80 x 40 cm)', 'Large Executive (100 x 50 cm)'],
    specs: {
      'Leather': 'Tuscan Full-Grain Vegetable Tanned Leather',
      'Charging Output': 'Dual 15W Qi2 Certified Fast Charging',
      'Underlay': 'Anti-slip Merino Wool Felt',
      'Cable': 'Braided 2m USB-C to USB-C 100W Cable'
    },
    features: [
      'Waterproof hydrophobic coating resists spills',
      'Patina develops unique character over years of use'
    ],
    frequentlyBoughtTogether: ['prod-005'],
    reviews: [
      {
        id: 'rev-7',
        author: 'Hannah Kim',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'Elevates the entire workspace',
        comment: 'The scent of genuine leather and the wireless charging works effortlessly.'
      }
    ]
  },
  {
    id: 'prod-007',
    name: 'Vortex Quantum DAC & Headphone Amplifier',
    tagline: 'Dual ESS Sabre Pro ES9038PRO 768kHz / DSD512 Reference Hub',
    category: 'Audio & Sound',
    price: 1120,
    originalPrice: 1350,
    rating: 4.96,
    reviewsCount: 64,
    stock: 4,
    isNew: false,
    isTrending: false,
    isBestSeller: false,
    featured: false,
    description: 'Reference-class desktop Digital-to-Analog converter with discrete Class-A amplification. Delivers 6000mW balanced power output per channel to effortlessly drive any headphone impedance with pitch-black noise floor.',
    heroImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Space Gray Machined', hex: '#374151', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Standard Edition', 'Master Clock BNC Edition (+ $250)'],
    specs: {
      'DAC Chip': 'Dual Flagship ESS Sabre ES9038PRO 32-bit',
      'Output Power': '6000mW @ 32Ω Balanced XLR',
      'Supported Formats': 'PCM up to 768kHz, DSD512 Native, MQA Full Decoder',
      'SNR': '132 dB Dynamic Range',
      'Inputs': 'USB-C XMOS XU316, Optical, Coaxial, Bluetooth LDAC 96kHz'
    },
    features: [
      'Discrete Relay Resistor Volume Control for perfect channel matching',
      'Vibration-isolated solid alloy feet with ceramic bearings'
    ],
    frequentlyBoughtTogether: ['prod-002'],
    reviews: [
      {
        id: 'rev-8',
        author: 'Dr. Arthur Sterling',
        rating: 5,
        date: '3 weeks ago',
        verified: true,
        title: 'Masterpiece of engineering',
        comment: 'Drives my planar headphones effortlessly. Zero hiss, holographic instrument separation.'
      }
    ]
  },
  {
    id: 'prod-008',
    name: 'Aura Halo Ambient Smart Luminaire',
    tagline: 'Circadian Spectral Tuning & Sunset Atmosphere Lamp',
    category: 'Smart Living',
    price: 340,
    originalPrice: 420,
    rating: 4.89,
    reviewsCount: 115,
    stock: 14,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    featured: false,
    description: 'Precision optical glass dome with dual-axis magnetic fluid dispersion. Automatically synchronizes with your local circadian rhythm to enhance focus during the day and release natural melatonin at night.',
    heroImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Brushed Brass', hex: '#ca8a04', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Matte Obsidian', hex: '#18181b', img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Desk Luminaire (35cm)', 'Floor Standing Luminaire (140cm + $190)'],
    specs: {
      'Color Temperature': '1800K (Warm Candlelight) to 6500K (Crisp Daylight)',
      'CRI': 'CRI 98+ Natural Sunlight Spectrum',
      'Luminous Flux': '1400 Lumens Max Dimmable',
      'Smart Home': 'Apple HomeKit, Matter, Google Home, Thread'
    },
    features: [
      'Contactless optical wave gesture dimming',
      'Biophilic sunset simulation with dynamic gradient projection'
    ],
    frequentlyBoughtTogether: ['prod-005', 'prod-006'],
    reviews: [
      {
        id: 'rev-9',
        author: 'Sophie L.',
        rating: 5,
        date: '6 days ago',
        verified: true,
        title: 'Deeply relaxing ambient light',
        comment: 'The evening sunset fade has dramatically improved my sleep routine. Gorgeous design.'
      }
    ]
  },
  {
    id: 'prod-010',
    name: 'Kyoto Hand-Forged Damascus Pocket Knife',
    tagline: '67-Layer VG-10 Core Damascus Steel & Desert Ironwood Handle',
    category: 'Designer Essentials',
    price: 310,
    originalPrice: 380,
    rating: 4.94,
    reviewsCount: 160,
    stock: 11,
    isNew: false,
    isTrending: false,
    isBestSeller: false,
    featured: false,
    description: 'Hand-crafted by master bladesmiths in Seki, Japan. Featuring a 67-layer acid-etched Damascus blade around a super-hard VG-10 steel core with ceramic ball-bearing pivot and titanium frame lock.',
    heroImage: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Ironwood & Damascus', hex: '#78350f', img: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Drop Point Blade', 'Tanto Precision Blade'],
    specs: {
      'Blade Steel': '67-Layer VG-10 Core Damascus (61 HRC)',
      'Blade Length': '3.25 inches / 8.2 cm',
      'Handle': 'Grade 5 Titanium & Arizona Desert Ironwood',
      'Pivot': 'Caged Ceramic Ball Bearings for instantaneous snap opening'
    },
    features: [
      'Razor sharp 15-degree edge bevel polished to mirror finish',
      'Deep carry reversible titanium pocket clip'
    ],
    frequentlyBoughtTogether: ['prod-003'],
    reviews: [
      {
        id: 'rev-11',
        author: 'Daisuke K.',
        rating: 5,
        date: '2 weeks ago',
        verified: true,
        title: 'Impeccable Japanese craftsmanship',
        comment: 'Action is smooth as silk. The damascus ripples are hypnotic.'
      }
    ]
  },
  {
    id: 'prod-011',
    name: 'Aura Nebula True Wireless Earbuds',
    tagline: 'Hybrid Dual-Driver ANC with Lossless Spatial Audio',
    category: 'Audio & Sound',
    price: 360,
    originalPrice: 420,
    rating: 4.87,
    reviewsCount: 204,
    stock: 22,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    featured: false,
    description: 'Custom 11mm beryllium dynamic driver paired with Knowles balanced armature. Adaptive real-time active noise cancellation at 48dB with transparency mode and Qi-compatible ceramic charging case.',
    heroImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Ceramic White', hex: '#f8fafc', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Onyx Black', hex: '#0f172a', img: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Standard Edition', 'Lossless Wireless USB-C Dongle Bundle (+ $40)'],
    specs: {
      'Drivers': '11mm Beryllium Dynamic + Knowles Balanced Armature',
      'Noise Cancellation': 'Hybrid ANC up to -48dB with Wind-Noise Reduction',
      'Battery Life': '9 Hours per charge (36 Hours with case)',
      'Water Resistance': 'IPX5 Sweat and Rain Resistant'
    },
    features: [
      'Lossless LDAC & aptX Adaptive 24-bit/96kHz support',
      'Custom bone-conduction microphones for crystal clear calls'
    ],
    frequentlyBoughtTogether: ['prod-006', 'prod-003'],
    reviews: [
      {
        id: 'rev-12',
        author: 'Rania Al-Mansoor',
        rating: 5,
        date: '4 days ago',
        verified: true,
        title: 'Cancels city noise completely',
        comment: 'The instrument separation on classical tracks is stunning for in-ear monitors.'
      }
    ]
  },
  {
    id: 'prod-012',
    name: 'Zenith MagLev Hovering Bluetooth Speaker',
    tagline: 'True Magnetic Levitation 360-Degree Omnidirectional Sound',
    category: 'Audio & Sound',
    price: 495,
    originalPrice: 580,
    rating: 4.82,
    reviewsCount: 52,
    stock: 8,
    isNew: true,
    isTrending: false,
    isBestSeller: false,
    featured: false,
    description: 'Suspended in mid-air above an electromagnetic mirror base. Free from surface acoustic dampening, producing frictionless 360-degree high-fidelity acoustics with pulsing ambient glow.',
    heroImage: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Orb Black & Cyan Glow', hex: '#0f172a', img: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Orb Pearl Silver', hex: '#cbd5e1', img: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=85' }
    ],
    storageOptions: ['Single Orb + Base', 'Stereo Pair Duo (+ $450)'],
    specs: {
      'Levitation': 'Electromagnetic 20mm Air Suspension Base',
      'Acoustic Driver': '50mm Neodymium Full-Range + Downward Bass Radiator',
      'Power': '25W RMS Omnidirectional Output',
      'Battery': '10 Hours Continuous Orb Playback (Auto-recharging base)'
    },
    features: [
      'Zero surface contact eliminates mechanical audio rattling',
      'Base features dual Qi charging and USB-C power out'
    ],
    frequentlyBoughtTogether: ['prod-008'],
    reviews: [
      {
        id: 'rev-13',
        author: 'Liam Gallagher',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'Conversation starter of the year',
        comment: 'Everyone who visits my studio asks about it. Sound quality is surprisingly rich and room-filling.'
      }
    ]
  }
];

export const CATEGORIES = [
  'All Products',
  'Spatial Optics',
  'Audio & Sound',
  'Wearables',
  'Smart Living',
  'Designer Essentials'
];

export const PROMO_CODES = {
  'SAVE20': { discountPercent: 20, description: '20% Off Storewide' },
  'LUXE15': { discountPercent: 15, description: '15% Luxury VIP Discount' },
  'FREESHIP': { freeShipping: true, description: 'Free Global Express Courier' }
};

export const RECENT_SALES_NOTIFICATIONS = [
  { user: 'Søren from Copenhagen', item: 'Aura Horizon Spatial Vision Glass', time: '2 mins ago' },
  { user: 'Chloe from Paris', item: 'Acoustics Apex Master Planar Headphones', time: '5 mins ago' },
  { user: 'Kenji from Tokyo', item: 'Chronos Cybernetic Titanium Smartwatch', time: '11 mins ago' },
  { user: 'Maya from New York', item: 'Aether Key Mechanical Studio Keyboard', time: '14 mins ago' },
  { user: 'Alexander from Zurich', item: 'Luminary Monolith Hi-Fi Wireless Soundbar', time: '18 mins ago' }
];

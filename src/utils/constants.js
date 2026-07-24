// API Configuration — PHP/MySQL backend served by XAMPP (see backend/README.md)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/ibrali-api'

// Tour Packages Data
export const TOUR_PACKAGES = [
  {
    id: 1,
    title: 'Safari Adventure',
    destination: 'Masai Mara',
    duration: 5,
    price: 2500,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop',
    rating: 4.8,
    reviews: 45,
    category: 'safari',
    description: 'Experience the thrilling wildlife of Masai Mara with expert guides. Witness the great migration and diverse wildlife.',
    highlights: [
      'Big Five sightings',
      'Professional guides',
      'Comfortable accommodations',
      'Game drives twice daily',
      'Photography opportunities'
    ],
    inclusions: [
      'Accommodation',
      'All meals',
      'Game drives',
      'Park fees',
      'Ground transport'
    ],
    maxTravelers: 8,
    difficulty: 'Easy',
    bestTime: 'Jun-Oct, Dec-Feb'
  },
  {
    id: 2,
    title: 'Beach Paradise',
    destination: 'Mombasa',
    duration: 7,
    price: 1800,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
    rating: 4.9,
    reviews: 62,
    category: 'beach',
    description: 'Relax on pristine white sandy beaches with crystal clear waters. Perfect for swimming, snorkeling, and water sports.',
    highlights: [
      'White sandy beaches',
      'Water sports',
      'Snorkeling opportunities',
      'Sunset beach walks',
      'Beachfront dining'
    ],
    inclusions: [
      'Beachfront resort stay',
      'All meals',
      'Beach activities',
      'Airport transfers',
      'Guided tours'
    ],
    maxTravelers: 20,
    difficulty: 'Easy',
    bestTime: 'Year-round'
  },
  {
    id: 3,
    title: 'Mountain Trek',
    destination: 'Mount Kenya',
    duration: 4,
    price: 1500,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
    rating: 4.7,
    reviews: 38,
    category: 'trekking',
    description: 'Climb Africa\'s second-highest mountain. Enjoy breathtaking views and challenging trails through diverse ecosystems.',
    highlights: [
      'Summit experience',
      'Alpine scenery',
      'Wildlife viewing',
      'Experienced mountain guides',
      'High altitude adventure'
    ],
    inclusions: [
      'Mountain hut accommodation',
      'All meals',
      'Professional guides',
      'Climbing equipment',
      'Transport to base'
    ],
    maxTravelers: 6,
    difficulty: 'Hard',
    bestTime: 'Jan-Feb, Aug-Sep'
  },
  {
    id: 4,
    title: 'City Tour',
    destination: 'Nairobi',
    duration: 3,
    price: 800,
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=500&fit=crop',
    rating: 4.5,
    reviews: 28,
    category: 'city',
    description: 'Explore Kenya\'s vibrant capital city. Visit museums, markets, and cultural landmarks.',
    highlights: [
      'National Museum',
      'Karen Blixen Museum',
      'Giraffe Centre',
      'Nairobi National Park',
      'Local markets'
    ],
    inclusions: [
      'Hotel accommodation',
      'Breakfast',
      'Guided city tours',
      'Museum entries',
      'Local transport'
    ],
    maxTravelers: 10,
    difficulty: 'Easy',
    bestTime: 'Year-round'
  },
  {
    id: 5,
    title: 'Lake Nakuru',
    destination: 'Lake Nakuru',
    duration: 2,
    price: 600,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop',
    rating: 4.6,
    reviews: 35,
    category: 'wildlife',
    description: 'Visit the famous Lake Nakuru known for its pink flamingos and diverse wildlife. A perfect quick getaway.',
    highlights: [
      'Pink flamingos',
      'Rhino viewing',
      'Birdwatching',
      'Scenic lake views',
      'Photography spots'
    ],
    inclusions: [
      'Lodge accommodation',
      'All meals',
      'Game drive',
      'Park entrance fees',
      'Professional guide'
    ],
    maxTravelers: 12,
    difficulty: 'Easy',
    bestTime: 'Year-round'
  },
  {
    id: 6,
    title: 'Luxury Safari',
    destination: 'Samburu',
    duration: 6,
    price: 3500,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop',
    rating: 4.9,
    reviews: 52,
    category: 'safari',
    description: 'Experience ultimate luxury in the remote Samburu landscape. Exclusive access to pristine wilderness.',
    highlights: [
      'Luxury accommodations',
      'Private game drives',
      'Exclusive access',
      'Gourmet dining',
      'Spa services'
    ],
    inclusions: [
      'Luxury lodge',
      'All meals and drinks',
      'Private guide',
      'Bush walks',
      'Transfers and flights'
    ],
    maxTravelers: 4,
    difficulty: 'Easy',
    bestTime: 'Jun-Oct, Dec-Feb'
  },
  {
    id: 7,
    title: 'Cultural Experience',
    destination: 'Maasai Village',
    duration: 3,
    price: 650,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop',
    rating: 4.8,
    reviews: 41,
    category: 'cultural',
    description: 'Immerse yourself in Maasai culture. Meet local communities and learn about traditional way of life.',
    highlights: [
      'Traditional ceremonies',
      'Cultural workshops',
      'Local crafts',
      'Traditional meals',
      'Village tour'
    ],
    inclusions: [
      'Cultural guide',
      'Maasai village tour',
      'Craft workshop',
      'Traditional lunch',
      'Transport'
    ],
    maxTravelers: 15,
    difficulty: 'Easy',
    bestTime: 'Year-round'
  },
  {
    id: 8,
    title: 'Adventure Combo',
    destination: 'Multiple Destinations',
    duration: 10,
    price: 4500,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop',
    rating: 4.9,
    reviews: 29,
    category: 'adventure',
    description: 'Ultimate Kenya experience combining safari, beach, mountains, and culture in one epic journey.',
    highlights: [
      'All-inclusive experience',
      'Multiple destinations',
      'Diverse activities',
      'Expert guides',
      'Unforgettable memories'
    ],
    inclusions: [
      'All accommodations',
      'All meals',
      'All activities',
      'All transport',
      'Travel insurance'
    ],
    maxTravelers: 6,
    difficulty: 'Medium',
    bestTime: 'Year-round'
  },
  {
    id: 9,
    title: 'Congo Rainforest Trek',
    destination: 'Virunga National Park, DR Congo',
    duration: 6,
    price: 2800,
    image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&h=500&fit=crop',
    rating: 4.8,
    reviews: 22,
    category: 'trekking',
    description: 'Trek through the lush rainforests of the Democratic Republic of Congo in search of mountain gorillas and rare wildlife in one of Africa\'s most biodiverse regions.',
    highlights: [
      'Guided rainforest treks',
      'Rare wildlife encounters',
      'Experienced local guides',
      'Cultural village visits',
      'Small group expeditions'
    ],
    inclusions: [
      'Permits and park fees',
      'Lodge accommodation',
      'All meals',
      'Professional guides',
      'Ground transport'
    ],
    maxTravelers: 6,
    difficulty: 'Hard',
    bestTime: 'Jun-Sep, Dec-Feb'
  },
  {
    id: 10,
    title: 'Dubai City & Desert Escape',
    destination: 'Dubai, UAE',
    duration: 5,
    price: 1900,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop',
    rating: 4.9,
    reviews: 47,
    category: 'city',
    description: 'Experience the best of Dubai — from towering skyscrapers and luxury shopping to a thrilling desert safari under the stars.',
    highlights: [
      'Burj Khalifa observation deck',
      'Desert safari with dune bashing',
      'Dhow cruise dinner',
      'Old Dubai & souks tour',
      'Luxury shopping districts'
    ],
    inclusions: [
      'Hotel accommodation',
      'Airport transfers',
      'Desert safari',
      'City tour',
      'Daily breakfast'
    ],
    maxTravelers: 10,
    difficulty: 'Easy',
    bestTime: 'Nov-Mar'
  },
  {
    id: 11,
    title: 'Paris & the Seine',
    destination: 'Paris, France',
    duration: 7,
    price: 3200,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop',
    rating: 4.9,
    reviews: 31,
    category: 'cultural',
    description: 'Discover the romance of Paris — the Eiffel Tower, world-class museums, charming cafes, and a leisurely cruise along the Seine.',
    highlights: [
      'Eiffel Tower visit',
      'Louvre Museum tour',
      'Seine river cruise',
      'Montmartre walking tour',
      'Fine dining experiences'
    ],
    inclusions: [
      'Hotel accommodation',
      'Daily breakfast',
      'Guided city tours',
      'Museum entries',
      'Airport transfers'
    ],
    maxTravelers: 8,
    difficulty: 'Easy',
    bestTime: 'Apr-Jun, Sep-Oct'
  },
  {
    id: 12,
    title: 'Maldives Overwater Escape',
    destination: 'Maldives',
    duration: 6,
    price: 4200,
    image: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=800&h=500&fit=crop',
    rating: 5.0,
    reviews: 18,
    category: 'beach',
    description: 'Unwind in an overwater villa surrounded by turquoise lagoons — the ultimate luxury beach escape for honeymooners and beach lovers alike.',
    highlights: [
      'Overwater villa stay',
      'Snorkeling & diving',
      'Private sunset cruise',
      'Spa treatments',
      'All-inclusive dining'
    ],
    inclusions: [
      'Overwater villa accommodation',
      'All meals and drinks',
      'Seaplane transfers',
      'Snorkeling equipment',
      'Spa credit'
    ],
    maxTravelers: 2,
    difficulty: 'Easy',
    bestTime: 'Year-round'
  }
]

// Blog posts
export const BLOG_POSTS = [
  {
    slug: 'best-time-masai-mara-great-migration',
    title: 'Best Time to Visit Masai Mara for the Great Migration',
    excerpt: 'Timing is everything when it comes to witnessing over a million wildebeest cross the Mara River. Here is how to plan your trip around it.',
    category: 'Safari Guide',
    author: 'Ibrali Travel Desk',
    date: '2026-05-14',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
    content: [
      'The Great Migration is one of the most spectacular wildlife events on Earth, and getting the timing right can be the difference between a good safari and an unforgettable one. Over two million wildebeest, zebra, and gazelle move in a continuous loop between the Serengeti and the Masai Mara in search of fresh grazing.',
      'The dramatic river crossings — where herds brave crocodile-infested waters at the Mara River — typically peak between July and October, making this the most sought-after window for safari travellers. Game drives during this period reward visitors with dense concentrations of predators trailing the herds.',
      'Outside the migration season, the Mara is far from quiet. The calving season in January and February brings newborn wildebeest and, with them, high predator activity as lions and cheetahs take advantage of vulnerable young. Shoulder months also mean smaller crowds and better rates on camps and lodges.',
      'Our team plans migration-season itineraries months in advance to secure the best camps along the river crossing points. If a Great Migration safari is on your list, reach out early — availability during peak months fills up fast.',
    ],
  },
  {
    slug: 'safari-packing-essentials',
    title: 'A Complete Guide to Safari Packing Essentials',
    excerpt: 'From neutral-toned clothing to the right camera gear, here is exactly what to pack for a smooth, comfortable safari experience.',
    category: 'Travel Tips',
    author: 'Ibrali Travel Desk',
    date: '2026-04-02',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&q=80',
    content: [
      'Packing for a safari is different from packing for any other kind of holiday. Space is limited on light aircraft transfers, temperatures swing widely between dawn game drives and midday heat, and the right gear can make or break your comfort in the bush.',
      'Stick to neutral tones — khaki, olive, and sand colours blend into the landscape and, more importantly, do not attract tsetse flies the way bright colours and dark blues do. Layers matter too: early morning drives can be surprisingly cold, while afternoons are warm and dusty.',
      'A good pair of binoculars, a wide-brimmed hat, high-SPF sunscreen, and a reliable power bank for your camera and phone round out the essentials. Most camps offer laundry service, so you can travel lighter than you think — five to seven days of clothing is usually enough for a two-week trip.',
      'Not sure what your specific itinerary requires? Our travel consultants provide a tailored packing list with every booking, based on your destinations, season, and activities.',
    ],
  },
  {
    slug: 'sustainable-tourism-kenya',
    title: "Sustainable Tourism: How Ibrali Protects Kenya's Wonders",
    excerpt: 'Exploring the world responsibly means leaving destinations better than we found them. Here is how we approach sustainable travel.',
    category: 'Responsible Travel',
    author: 'Ibrali Travel Desk',
    date: '2026-03-11',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80',
    content: [
      'Our tagline — "Exploring the World, Protecting Its Wonders" — is not just a slogan. Every itinerary we build is designed with the long-term health of Kenya\'s wildlife, landscapes, and communities in mind.',
      'We work with camps and lodges that employ local staff, source produce from nearby communities, and reinvest in conservation programs. Where possible, we route travellers through community conservancies, where tourism revenue directly funds anti-poaching efforts and habitat protection.',
      'Responsible tourism also means respecting the people who call these places home — from asking permission before photographing communities to ensuring cultural visits are conducted with dignity and fair compensation.',
      'Choosing a travel partner that takes these questions seriously does not mean compromising on comfort or adventure. It means your trip leaves a positive mark long after you have returned home.',
    ],
  },
  {
    slug: 'corporate-retreats-kenya',
    title: 'Corporate Retreats: Why Kenya Is the Perfect Destination',
    excerpt: 'From lakeside conference venues to team-building safaris, Kenya offers a compelling backdrop for your next corporate offsite.',
    category: 'Corporate Travel',
    author: 'Ibrali Travel Desk',
    date: '2026-02-20',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
    content: [
      'Corporate retreats work best when they pull teams out of the everyday and into an environment that encourages genuine connection. Kenya delivers on that in ways few other destinations can — dramatic landscapes, world-class hospitality, and activities built for collaboration.',
      'Nairobi offers modern conference facilities minutes from game parks, making it easy to pair a morning workshop with an afternoon safari. Further afield, lakeside venues around Naivasha and Nakuru combine boardroom-ready spaces with birdwatching, boat cruises, and team challenges.',
      'We handle the logistics end-to-end: venue sourcing, transport, accommodation, and curated team-building activities such as guided bush walks and cultural village visits, so your HR and events team can focus on the agenda, not the arrangements.',
      'Planning an offsite for 10 people or 200, our corporate travel desk builds a proposal around your budget, dates, and objectives.',
    ],
  },
]

// Booking statuses
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
}

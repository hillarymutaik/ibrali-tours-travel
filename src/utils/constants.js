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
  }
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

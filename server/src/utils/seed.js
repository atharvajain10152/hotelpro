import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, closeDB } from '../config/db.js';

import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import RoomCategory from '../models/RoomCategory.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import HousekeepingTask from '../models/HousekeepingTask.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Review from '../models/Review.js';
import AuditLog from '../models/AuditLog.js';

import {
  ROLES,
  HOTEL_STATUS,
  ROOM_STATUS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  HOUSEKEEPING_STATUS,
  SERVICE_REQUEST_STATUS
} from '../config/constants.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Starting database seeding...');
    await connectDB();

    // Clear existing records
    await Promise.all([
      User.deleteMany({}),
      Hotel.deleteMany({}),
      RoomCategory.deleteMany({}),
      Room.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      HousekeepingTask.deleteMany({}),
      ServiceRequest.deleteMany({}),
      Review.deleteMany({}),
      AuditLog.deleteMany({})
    ]);

    console.log('[Seed] Cleared existing records.');

    // 1. Create Hotels
    const hotel1 = await Hotel.create({
      name: 'The Grand Royal Palace & Spa',
      tagline: 'Waterfront Palace Blending Edwardian Heritage With Legendary Luxury',
      description:
        'A legendary 5-star waterfront sanctuary blending heritage architecture with modern luxury. Features an iconic infinity pool overlooking the bay, Michelin-star dining, and a world-renowned wellness spa.',
      address: '1 Apollo Bunder, Colaba',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
      starRating: 5,
      averageRating: 4.9,
      reviewCount: 38,
      contactEmail: 'concierge.mumbai@grandroyal.com',
      contactPhone: '+91 22 6665 3366',
      amenities: [
        'Free High-Speed Wi-Fi',
        'Bayview Infinity Pool',
        'Jiva Luxury Spa & Wellness',
        '24/7 Butler Service',
        'Fine Dining French & Indian Restaurants',
        'Private Airport Limousine Transfers',
        'State-of-the-art Fitness Center',
        'Valet Parking'
      ],
      highlights: [
        'Panoramic Arabian Sea & Gateway of India Views',
        '24/7 Royal White-Glove Butler Service',
        'Celebrated Jiva Ayurvedic Spa Sanctuary',
        'Michelin-Curated Restaurants & Historic Harbour Bar',
        'Private Luxury Limousine Fleet & Helipad Access'
      ],
      dining: [
        {
          name: 'The Zodiac Dining Room',
          cuisine: 'French & Mediterranean Haute Cuisine',
          hours: '19:00 - 23:30',
          dressCode: 'Formal Elegance',
          description: 'Curated seasonal tasting menus paired with sommelier selections overlooking the illuminated harbor.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Golden Dragon Imperial Court',
          cuisine: 'Sichuan & Cantonese Gourmet',
          hours: '12:30 - 15:00 & 19:30 - 23:30',
          dressCode: 'Smart Casual',
          description: 'Legendary imperial recipes crafted by master chefs, featuring Peking Duck and handcrafted dim sum.',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Sea Lounge High Tea',
          cuisine: 'Artisan Patisserie & Colonial High Tea',
          hours: '10:00 - 22:00',
          dressCode: 'Smart Casual',
          description: 'Iconic afternoon high tea with live piano melodies and uninterrupted ocean panoramas.',
          image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'The Historic Harbour Bar',
          cuisine: 'Signature Cocktails & Rare Malts',
          hours: '17:00 - 01:30',
          dressCode: 'Smart Casual',
          description: 'The premier licensed cocktail bar in Western India, crafting prohibition-era signature libations.',
          image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80'
        }
      ],
      wellness: {
        title: 'Jiva Imperial Spa & Wellness Sanctuary',
        description: 'A tranquil 12,000 sq.ft oasis steeped in royal Indian healing therapies, signature aromatherapy, and ancient wellness sciences.',
        hours: '06:00 - 22:30',
        facilities: [
          'Ayurvedic Consultation & Therapy Suites',
          'Heated Bayside Hydrotherapy Vitality Pool',
          'Himalayan Salt Steam Rooms & Cedar Saunas',
          '24/7 Technogym Olympic Fitness Studio',
          'Sunken Relaxation Lounges & Herbarium'
        ]
      },
      policies: {
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'Free cancellation up to 48 hours prior to check-in. Full refund guaranteed within window.',
        petPolicy: 'Guide dogs and well-behaved small pets (under 12kg) welcomed in designated garden suites upon advance notice.',
        smokingPolicy: '100% smoke-free property indoors. Dedicated outdoor smoking pavilion located at the South Terrace.',
        childPolicy: 'Children under 6 stay complimentary sharing parent bedding. Rollaway suites available on request.',
        depositPolicy: 'Government photo identification and credit card pre-authorization required upon registration.'
      },
      nearbyAttractions: [
        {
          name: 'Gateway of India',
          distance: '0.1 km (1 min walk)',
          category: 'Historic Landmark',
          description: 'Iconic 20th-century arch monument overlooking Mumbai harbour.'
        },
        {
          name: 'Colaba Causeway Promenade',
          distance: '0.4 km (5 min walk)',
          category: 'Shopping & Culture',
          description: 'Bustling boulevard of heritage art galleries, chic bistros, and antique boutiques.'
        },
        {
          name: 'Chhatrapati Shivaji Maharaj Vastu Museum',
          distance: '0.9 km (10 min walk)',
          category: 'Art & Heritage',
          description: 'Premier heritage museum holding over 50,000 historic antiquities.'
        },
        {
          name: 'Marine Drive Queens Necklace',
          distance: '2.5 km (8 min drive)',
          category: 'Scenic Coastal',
          description: 'Famous 3.6-kilometer seaside promenade offering spectacular sunset vistas.'
        }
      ],
      propertyDetails: {
        yearBuilt: 1903,
        architecturalStyle: 'Indo-Saracenic & Florentine Renaissance',
        totalFloors: 7,
        totalRooms: 285,
        airportDistance: '24 km from Chhatrapati Shivaji Maharaj International Airport (BOM)'
      },
      faqs: [
        {
          question: 'What are the check-in and check-out times?',
          answer: 'Check-in is guaranteed from 14:00 onwards, and check-out is until 11:00. Early check-in or late check-out is accommodated subject to availability.'
        },
        {
          question: 'Is airport limousine transportation available?',
          answer: 'Yes, we provide luxury airport transfers in our private fleet of BMW 7-Series and Mercedes limousines with Wi-Fi and chilled refreshments.'
        },
        {
          question: 'Are breakfast and dining reservations included?',
          answer: 'Royal Executive packages include daily breakfast buffet at Sea Lounge. Priority reservations for dinner can be placed with our 24/7 concierge.'
        },
        {
          question: 'Can special dietary or allergy requests be accommodated?',
          answer: 'Our executive chefs cater to vegan, gluten-free, Jain, halal, and customized nutritional plans.'
        }
      ],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
      ],
      status: HOTEL_STATUS.ACTIVE,
      checkInTime: '14:00',
      checkOutTime: '11:00'
    });

    const hotel2 = await Hotel.create({
      name: 'Azure Cove Beachfront Villa & Resort',
      tagline: 'Exclusive Private Villa Haven on the Sun-Drenched Sands of North Goa',
      description:
        'Nestled directly on the pristine white sands of North Goa, Azure Cove offers private seaside villas, sunset cabanas, world-class beach bar, and tranquil tropical gardens.',
      address: 'Calangute Beach Road, Candolim',
      city: 'Goa',
      state: 'Goa',
      country: 'India',
      postalCode: '403515',
      starRating: 5,
      averageRating: 4.8,
      reviewCount: 24,
      contactEmail: 'stay@azurecovegoa.com',
      contactPhone: '+91 832 248 9900',
      amenities: [
        'Private Beach Access',
        'Beachfront Cabanas',
        'Infinity Ocean Pool',
        'Seafood Grill & Sunset Lounge',
        'Water Sports Center',
        'Yoga Pavilion',
        'Free High-Speed Wi-Fi'
      ],
      highlights: [
        'Direct Private Access to Candolim White Sands',
        'Secluded Oceanfront Plunge-Pool Villas',
        'Sunset Mixology Lounge & Fresh Seafood Grill',
        'Daily Sunrise Beach Yoga & Sound Healing',
        'Speedboat & Catamaran Coastal Charters'
      ],
      dining: [
        {
          name: 'The Fisherman Wharf Ocean Grill',
          cuisine: 'Coastal Goan & Fresh Seafood Catch',
          hours: '12:00 - 23:00',
          dressCode: 'Resort Casual',
          description: 'Live daily catch grilled over coconut charcoal with authentic Portuguese-Goan peri-peri marinades.',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Azure Cove Sunset Cabana Bar',
          cuisine: 'Tapas, Tropical Cocktails & Mezze',
          hours: '16:00 - 00:30',
          dressCode: 'Resort Casual',
          description: 'Handcrafted botanic cocktails and sunset chillout acoustic sessions right by the gentle surf.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
        }
      ],
      wellness: {
        title: 'Breeze Oceanfront Wellness Pavilion',
        description: 'Open-air Ayurvedic wellness shalas set amidst whispering palms and ocean breezes.',
        hours: '07:00 - 20:00',
        facilities: [
          'Beachside Open-Air Massage Shalas',
          'Freshwater Infinity Lagoon Pool',
          'Aromatherapy Steam Sanctuary',
          'Morning Vinyasa Yoga Deck'
        ]
      },
      policies: {
        checkInTime: '15:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Free cancellation up to 72 hours before arrival.',
        petPolicy: 'Pet-friendly resort with specialized pet beds and beach run areas in select garden villas.',
        smokingPolicy: 'Non-smoking indoor villas. Smoking permitted on private outdoor sun decks.',
        childPolicy: 'Kids under 8 stay free with family. Kids beach club and splash zone included.',
        depositPolicy: 'One-night authorization deposit at check-in.'
      },
      nearbyAttractions: [
        {
          name: 'Aguada Fort & Lighthouse',
          distance: '3.2 km (7 min drive)',
          category: 'Historic Fortress',
          description: '17th-century Portuguese fort offering sweeping panoramic views of Sinquerim beach.'
        },
        {
          name: 'Candolim Beach Water Sports',
          distance: '0.2 km (2 min walk)',
          category: 'Adventure & Leisure',
          description: 'Parasailing, jet skis, and dolphin watching boat trips.'
        },
        {
          name: 'Saturday Night Market Arpora',
          distance: '6.5 km (15 min drive)',
          category: 'Nightlife & Culture',
          description: 'World-renowned bohemian night bazaar with live bands, fashion, and global cuisine.'
        }
      ],
      propertyDetails: {
        yearBuilt: 2018,
        architecturalStyle: 'Contemporary Tropical & Coastal Portuguese',
        totalFloors: 2,
        totalRooms: 68,
        airportDistance: '35 km from Goa International Airport (GOI / Manohar Mopa)'
      },
      faqs: [
        {
          question: 'Is direct beach access provided?',
          answer: 'Yes, guests step directly from the villa lawns onto the private resort beach section with dedicated sun loungers and towel service.'
        },
        {
          question: 'Are water sports arranged on-site?',
          answer: 'Our on-site adventure concierge organizes sailing, windsurfing, scuba diving, and deep-sea game fishing.'
        }
      ],
      images: [
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80'
      ],
      status: HOTEL_STATUS.ACTIVE,
      checkInTime: '15:00',
      checkOutTime: '12:00'
    });

    const hotel3 = await Hotel.create({
      name: 'Udaivilas Lakefront Heritage Palace',
      tagline: 'Regal Mewari Palace Estate Overlooking the Shimmering Waters of Lake Pichola',
      description:
        'A regal palace estate situated on the tranquil banks of Lake Pichola. Designed with traditional dome courtyards, hand-carved stone columns, and sweeping vistas of the Aravali hills.',
      address: 'Haridas Ji Ki Magri, Mulla Talai',
      city: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
      postalCode: '313001',
      starRating: 5,
      averageRating: 4.9,
      reviewCount: 52,
      contactEmail: 'reservations@udaivilasresort.com',
      contactPhone: '+91 294 243 3300',
      amenities: [
        'Lakeview Swimming Pools',
        'Private Boat Transfers',
        'Heritage Spa Pavilions',
        'Rooftop Candlelight Dining',
        'Cultural Rajasthani Performances',
        'Valet & Chauffeur Services'
      ],
      highlights: [
        'Arrival by Private Decorated Ceremonial Shikara Boat',
        'Interconnecting Semi-Private Moat Pools for Premier Rooms',
        'Breathtaking Views of the City Palace & Jagmandir Island',
        'Traditional Mewari Royal Dinners under Domed Pavilions',
        'Hand-Carved Marble Domes & Gold-Leaf Architectural Detailing'
      ],
      dining: [
        {
          name: 'Suryamahal Royal Pavilion',
          cuisine: 'Authentic Rajasthani & Royal Mewari Thali',
          hours: '12:30 - 15:00 & 19:30 - 23:00',
          dressCode: 'Royal Formal',
          description: 'Dine like royalty beneath a celestial painted dome serving heritage Rajput delicacies such as Laal Maas.',
          image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Chandni Lake Terrace',
          cuisine: 'Contemporary Indian & Fusion',
          hours: '19:00 - 23:30',
          dressCode: 'Smart Casual',
          description: 'Open-air dining by candlelight with musical sitar performances and panoramic Lake Pichola views.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
        }
      ],
      wellness: {
        title: 'The Mewar Ayurvedic Spa Sanctuary',
        description: 'Imperial wellness therapies practiced with sacred oils and rose water treatments overlooking private reflecting lily ponds.',
        hours: '07:00 - 21:00',
        facilities: [
          'Royal Couple Treatment Suites',
          'Private Moat Lap Pools',
          'Herbal Steam & Rose Quartz Saunas',
          'Yoga in the Banyan Tree Courtyard'
        ]
      },
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Complimentary cancellation up to 7 days prior to arrival.',
        petPolicy: 'Regretfully, pets cannot be accommodated due to preservation of heritage artworks.',
        smokingPolicy: 'Non-smoking indoor suites. Designated courtyard areas available.',
        childPolicy: 'Children of all ages welcome. Heritage storytelling and junior chef classes available.',
        depositPolicy: 'Full guarantee required 7 days prior to check-in.'
      },
      nearbyAttractions: [
        {
          name: 'City Palace Complex',
          distance: '1.8 km (10 min by royal boat)',
          category: 'Royal Heritage',
          description: 'Rajasthan largest palace complex with stunning mosaics and royal museum.'
        },
        {
          name: 'Jagmandir Island Palace',
          distance: '1.2 km (8 min boat ride)',
          category: 'Historic Island',
          description: 'Stunning 17th-century island palace built on Lake Pichola.'
        },
        {
          name: 'Saheliyon-ki-Bari Gardens',
          distance: '4.5 km (15 min drive)',
          category: 'Botanical Heritage',
          description: 'Historic royal gardens adorned with marble elephants and lotus pools.'
        }
      ],
      propertyDetails: {
        yearBuilt: 2002,
        architecturalStyle: 'Traditional Rajasthani Mewar Palace',
        totalFloors: 3,
        totalRooms: 89,
        airportDistance: '27 km from Maharana Pratap Airport (UDR)'
      },
      faqs: [
        {
          question: 'How do guests arrive at the palace?',
          answer: 'Guests are greeted at our private lakeside jetty and escorted across Lake Pichola aboard handcrafted ceremonial Shikara boats.'
        },
        {
          question: 'Can private candlelight dinners by the lake be reserved?',
          answer: 'Yes, private dining pavilions on the lake promontory can be reserved for anniversaries and bespoke celebrations.'
        }
      ],
      images: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
      ],
      status: HOTEL_STATUS.ACTIVE,
      checkInTime: '14:00',
      checkOutTime: '12:00'
    });

    console.log('[Seed] Hotels created.');

    // 2. Create Users for all 4 roles (User pre-save hook automatically hashes plain password)
    const defaultPassword = 'Password@123';

    const admin = await User.create({
      name: 'Alexander Sterling (Platform Admin)',
      email: 'admin@hotelpro.com',
      password: defaultPassword,
      phone: '+91 98765 00001',
      role: ROLES.ADMIN,
      isEmailVerified: true
    });

    const manager = await User.create({
      name: 'Victoria Vance (Hotel Manager)',
      email: 'manager@hotelpro.com',
      password: defaultPassword,
      phone: '+91 98765 00002',
      role: ROLES.MANAGER,
      hotelId: hotel1._id,
      isEmailVerified: true
    });

    // Link manager back to hotel1
    hotel1.managerId = manager._id;
    await hotel1.save();

    const staff = await User.create({
      name: 'Rajesh Kumar (Front Desk Staff)',
      email: 'staff@hotelpro.com',
      password: defaultPassword,
      phone: '+91 98765 00003',
      role: ROLES.STAFF,
      hotelId: hotel1._id,
      isEmailVerified: true
    });

    const guest = await User.create({
      name: 'Elena Rostova (Guest)',
      email: 'guest@hotelpro.com',
      password: defaultPassword,
      phone: '+91 98765 00004',
      role: ROLES.GUEST,
      isEmailVerified: true
    });

    console.log('[Seed] Demo accounts created for all 4 roles.');

    // 3. Create Room Categories for Hotel 1
    const cat1 = await RoomCategory.create({
      hotelId: hotel1._id,
      name: 'Deluxe Heritage Harbour Suite',
      description:
        'Elegantly appointed 550 sq.ft suite with plush king bed, Italian marble bathroom, panoramic harbor views, and personalized butler service.',
      basePrice: 8500,
      capacity: { adults: 2, children: 1, maxGuests: 3 },
      bedType: 'King Bed',
      roomSizeSqFt: 550,
      amenities: [
        'Harbour View Private Balcony',
        'Smart 55" 4K Apple TV',
        'Nespresso Coffee System',
        'Deep Soaking Bathtub',
        'High-Speed Wi-Fi',
        'Personal Safe & Mini Bar'
      ],
      images: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'
      ],
      totalRooms: 6
    });

    const cat2 = await RoomCategory.create({
      hotelId: hotel1._id,
      name: 'Presidential Royal Palace Villa',
      description:
        'A magnificent 1,200 sq.ft two-bedroom sanctuary with private plunge pool, dining room, private bar, and 24-hour dedicated chef service.',
      basePrice: 22000,
      capacity: { adults: 4, children: 2, maxGuests: 6 },
      bedType: 'Double Suite',
      roomSizeSqFt: 1200,
      amenities: [
        'Private Temperature-Controlled Plunge Pool',
        'Private Butler & Dedicated Chef',
        'Walk-in Dressing Room',
        'Bose Surround Sound System',
        'Complimentary Dom Pérignon Welcome Bottle',
        'Limousine Chauffeur Service'
      ],
      images: [
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80'
      ],
      totalRooms: 3
    });

    // Room categories for Hotel 2 & 3
    await RoomCategory.create({
      hotelId: hotel2._id,
      name: 'Seaside Sunset Villa with Deck',
      description: 'Step directly onto the sand from your private sundeck with outdoor shower.',
      basePrice: 9500,
      capacity: { adults: 2, children: 1, maxGuests: 3 },
      bedType: 'King Bed',
      roomSizeSqFt: 620,
      totalRooms: 8
    });

    await RoomCategory.create({
      hotelId: hotel3._id,
      name: 'Lakeview Maharani Suite',
      description: 'Hand-painted fresco ceilings, private jharokha balcony over Lake Pichola.',
      basePrice: 14500,
      capacity: { adults: 2, children: 0, maxGuests: 2 },
      bedType: 'King Bed',
      roomSizeSqFt: 700,
      totalRooms: 5
    });

    console.log('[Seed] Room Categories created.');

    // 4. Create Physical Rooms for Hotel 1
    const room101 = await Room.create({
      hotelId: hotel1._id,
      categoryId: cat1._id,
      roomNumber: '101',
      floor: 1,
      operationalStatus: ROOM_STATUS.CLEAN
    });

    const room102 = await Room.create({
      hotelId: hotel1._id,
      categoryId: cat1._id,
      roomNumber: '102',
      floor: 1,
      operationalStatus: ROOM_STATUS.DIRTY
    });

    const room103 = await Room.create({
      hotelId: hotel1._id,
      categoryId: cat1._id,
      roomNumber: '103',
      floor: 1,
      operationalStatus: ROOM_STATUS.CLEAN
    });

    const room201 = await Room.create({
      hotelId: hotel1._id,
      categoryId: cat2._id,
      roomNumber: '201-PH',
      floor: 2,
      operationalStatus: ROOM_STATUS.CLEAN
    });

    console.log('[Seed] Physical Rooms created.');

    // 5. Create Sample Bookings in Various States
    // A. Confirmed upcoming booking
    const checkInFuture = new Date();
    checkInFuture.setDate(checkInFuture.getDate() + 5);
    const checkOutFuture = new Date();
    checkOutFuture.setDate(checkOutFuture.getDate() + 8);

    const bookingConfirmed = await Booking.create({
      bookingReference: 'HP-2026-90812',
      guestId: guest._id,
      hotelId: hotel1._id,
      categoryId: cat1._id,
      roomId: room101._id,
      checkInDate: checkInFuture,
      checkOutDate: checkOutFuture,
      nights: 3,
      guests: { adults: 2, children: 0 },
      status: BOOKING_STATUS.CONFIRMED,
      pricingBreakdown: {
        baseNightlyRate: 8500,
        nights: 3,
        roomSubtotal: 25500,
        extraGuestFee: 0,
        taxesAndFees: 4590,
        discount: 0,
        totalAmount: 30090,
        currency: 'INR'
      },
      paymentStatus: PAYMENT_STATUS.SUCCESSFUL,
      guestSnapshot: {
        name: guest.name,
        email: guest.email,
        phone: guest.phone
      },
      specialRequests: 'High floor preferred, late arrival around 8:00 PM.'
    });

    // Associated Payment
    await Payment.create({
      bookingId: bookingConfirmed._id,
      guestId: guest._id,
      hotelId: hotel1._id,
      amount: 30090,
      currency: 'INR',
      provider: 'mock',
      orderId: 'order_mock_seed_001',
      paymentId: 'pay_mock_seed_001',
      signature: 'signature_mock_seed_verified',
      status: PAYMENT_STATUS.SUCCESSFUL,
      idempotencyKey: 'idemp_seed_001'
    });

    // B. Currently In-House (Checked-In) booking
    const checkInToday = new Date();
    checkInToday.setDate(checkInToday.getDate() - 1);
    const checkOutTomorrow = new Date();
    checkOutTomorrow.setDate(checkOutTomorrow.getDate() + 2);

    const bookingCheckedIn = await Booking.create({
      bookingReference: 'HP-2026-88124',
      guestId: guest._id,
      hotelId: hotel1._id,
      categoryId: cat2._id,
      roomId: room201._id,
      checkInDate: checkInToday,
      checkOutDate: checkOutTomorrow,
      nights: 3,
      guests: { adults: 2, children: 1 },
      status: BOOKING_STATUS.CHECKED_IN,
      pricingBreakdown: {
        baseNightlyRate: 22000,
        nights: 3,
        roomSubtotal: 66000,
        extraGuestFee: 0,
        taxesAndFees: 11880,
        discount: 6600,
        totalAmount: 71280,
        currency: 'INR'
      },
      paymentStatus: PAYMENT_STATUS.SUCCESSFUL,
      guestSnapshot: {
        name: guest.name,
        email: guest.email,
        phone: guest.phone
      },
      checkedInAt: checkInToday
    });

    // C. Past Completed Stay (Checked-Out) - eligible for review
    const pastCheckIn = new Date();
    pastCheckIn.setDate(pastCheckIn.getDate() - 15);
    const pastCheckOut = new Date();
    pastCheckOut.setDate(pastCheckOut.getDate() - 12);

    const pastBooking = await Booking.create({
      bookingReference: 'HP-2026-75109',
      guestId: guest._id,
      hotelId: hotel1._id,
      categoryId: cat1._id,
      roomId: room103._id,
      checkInDate: pastCheckIn,
      checkOutDate: pastCheckOut,
      nights: 3,
      guests: { adults: 2, children: 0 },
      status: BOOKING_STATUS.CHECKED_OUT,
      pricingBreakdown: {
        baseNightlyRate: 8500,
        nights: 3,
        roomSubtotal: 25500,
        extraGuestFee: 0,
        taxesAndFees: 4590,
        discount: 0,
        totalAmount: 30090,
        currency: 'INR'
      },
      paymentStatus: PAYMENT_STATUS.SUCCESSFUL,
      guestSnapshot: {
        name: guest.name,
        email: guest.email,
        phone: guest.phone
      },
      checkedInAt: pastCheckIn,
      checkedOutAt: pastCheckOut
    });

    // 6. Verified Review for the completed stay
    await Review.create({
      hotelId: hotel1._id,
      guestId: guest._id,
      bookingId: pastBooking._id,
      rating: 5,
      title: 'Unforgettable regal luxury and phenomenal hospitality',
      comment:
        'From the moment our airport transfer pulled up to the palace, every staff member treated us like royalty. The harbour view suite was spotless, the infinity pool was magical at sunset, and the dining was Michelin standard. Truly world-class!',
      status: 'approved'
    });

    // 7. Housekeeping Task
    await HousekeepingTask.create({
      hotelId: hotel1._id,
      roomId: room102._id,
      assignedTo: staff._id,
      priority: 'high',
      status: HOUSEKEEPING_STATUS.PENDING,
      notes: 'Full deep clean requested before 2:00 PM check-in.'
    });

    // 8. Guest Service Request for current in-house booking
    await ServiceRequest.create({
      hotelId: hotel1._id,
      bookingId: bookingCheckedIn._id,
      guestId: guest._id,
      roomId: room201._id,
      requestType: 'towels',
      description: 'Please deliver 2 extra sets of plush bath towels and an extra feather pillow.',
      priority: 'medium',
      status: SERVICE_REQUEST_STATUS.SUBMITTED
    });

    // 9. Initial Audit Log
    await AuditLog.create({
      action: 'SYSTEM_DATABASE_SEEDED',
      userId: admin._id,
      userRole: ROLES.ADMIN,
      targetResource: 'System',
      targetId: 'seed_init',
      details: {
        hotels: 3,
        users: 4,
        rooms: 4,
        bookings: 3
      }
    });

    console.log('\n=============================================================');
    console.log('  HOTELPRO SEEDING COMPLETE! DEMO ACCOUNTS READY:');
    console.log('-------------------------------------------------------------');
    console.log('  1. Guest User:');
    console.log('     Email:    guest@hotelpro.com');
    console.log('     Password: Password@123');
    console.log('  2. Hotel Staff:');
    console.log('     Email:    staff@hotelpro.com');
    console.log('     Password: Password@123');
    console.log('  3. Hotel Manager:');
    console.log('     Email:    manager@hotelpro.com');
    console.log('     Password: Password@123');
    console.log('  4. Platform Admin:');
    console.log('     Email:    admin@hotelpro.com');
    console.log('     Password: Password@123');
    console.log('=============================================================\n');

    return true;
  } catch (err) {
    console.error('[Seed Error]:', err);
    throw err;
  }
};

// If run directly via CLI: node src/utils/seed.js
if (process.argv[1]?.includes('seed.js')) {
  seedDatabase()
    .then(async () => {
      console.log('[Seed] Database populated successfully.');
      await closeDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Failed]:', err);
      process.exit(1);
    });
}

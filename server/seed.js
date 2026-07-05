require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  // Electronics
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 40-hour battery life, and crystal-clear audio. Features Bluetooth 5.3, touch controls, and a foldable design for easy portability.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    category: 'Electronics',
    stock: 45,
    rating: 4.7,
    numReviews: 128
  },
  {
    name: 'Ultra-Slim 4K Monitor 27"',
    description: 'Stunning 27-inch 4K UHD IPS display with HDR10 support, 99% sRGB color accuracy, and ultra-thin bezels. USB-C connectivity with 65W power delivery for seamless laptop charging.',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    category: 'Electronics',
    stock: 20,
    rating: 4.5,
    numReviews: 89
  },
  {
    name: 'Smart Fitness Watch Pro',
    description: 'Advanced fitness tracker with AMOLED display, heart rate monitoring, GPS tracking, SpO2 sensor, and 14-day battery life. Water-resistant to 50 meters with 100+ workout modes.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    category: 'Electronics',
    stock: 60,
    rating: 4.6,
    numReviews: 256
  },
  {
    name: 'Mechanical RGB Keyboard',
    description: 'High-performance mechanical keyboard with tactile switches, customizable RGB backlighting, and a premium aluminum frame. Designed for both gaming and typing.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80',
    category: 'Electronics',
    stock: 35,
    rating: 4.8,
    numReviews: 210
  },
  {
    name: 'Ergonomic Wireless Mouse',
    description: 'Comfortable ergonomic wireless mouse with precision tracking, programmable buttons, and long-lasting battery. Reduces wrist strain during long sessions.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
    category: 'Electronics',
    stock: 75,
    rating: 4.5,
    numReviews: 180
  },
  // Clothing
  {
    name: 'Premium Merino Wool Sweater',
    description: 'Luxuriously soft 100% merino wool sweater in a classic crew neck design. Temperature-regulating, odor-resistant, and naturally breathable for all-day comfort.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80',
    category: 'Clothing',
    stock: 35,
    rating: 4.4,
    numReviews: 67
  },
  {
    name: 'Slim Fit Stretch Denim Jeans',
    description: 'Modern slim fit jeans crafted from premium stretch denim with 2% elastane for ultimate comfort and flexibility. Classic five-pocket styling with a contemporary silhouette.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80',
    category: 'Clothing',
    stock: 80,
    rating: 4.3,
    numReviews: 145
  },
  {
    name: 'Waterproof Technical Jacket',
    description: 'Engineered for extreme weather with a 3-layer waterproof breathable membrane, sealed seams, and adjustable hood. Lightweight yet incredibly protective for outdoor adventures.',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80',
    category: 'Clothing',
    stock: 25,
    rating: 4.8,
    numReviews: 93
  },
  {
    name: 'Classic White Sneakers',
    description: 'Minimalist white sneakers made from premium leather with a comfortable rubber sole. Versatile design that pairs well with any outfit.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80',
    category: 'Clothing',
    stock: 120,
    rating: 4.6,
    numReviews: 310
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Essential crewneck t-shirt made from 100% organic cotton. Exceptionally soft, durable, and ethically produced.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    category: 'Clothing',
    stock: 150,
    rating: 4.7,
    numReviews: 420
  },
  // Accessories
  {
    name: 'Italian Leather Messenger Bag',
    description: 'Handcrafted from full-grain Italian leather with brass hardware. Features padded laptop compartment (fits up to 15"), multiple organizer pockets, and adjustable crossbody strap.',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    category: 'Accessories',
    stock: 15,
    rating: 4.9,
    numReviews: 42
  },
  {
    name: 'Titanium Aviator Sunglasses',
    description: 'Lightweight titanium frame aviators with polarized CR-39 lenses offering 100% UV protection. Includes microfiber pouch and hardshell case.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
    category: 'Accessories',
    stock: 50,
    rating: 4.5,
    numReviews: 78
  },
  {
    name: 'Minimalist Automatic Watch',
    description: 'Swiss-movement automatic watch with sapphire crystal, 316L stainless steel case, and genuine leather strap. 42mm case diameter with 50m water resistance.',
    price: 329.99,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80',
    category: 'Accessories',
    stock: 12,
    rating: 4.7,
    numReviews: 56
  },
  {
    name: 'Slim Leather Wallet',
    description: 'Ultra-slim leather cardholder wallet that fits perfectly in your front pocket. Features RFID-blocking technology and holds up to 8 cards.',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
    category: 'Accessories',
    stock: 85,
    rating: 4.6,
    numReviews: 125
  },
  {
    name: 'Ribbed Knit Beanie',
    description: 'Cozy and stylish ribbed knit beanie made from a warm wool blend. Perfect for cold weather days while keeping your style on point.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80',
    category: 'Accessories',
    stock: 110,
    rating: 4.4,
    numReviews: 88
  },
  // Home & Living
  {
    name: 'Artisan Ceramic Table Lamp',
    description: 'Hand-thrown ceramic lamp with a unique reactive glaze finish. Features a linen drum shade, 3-way touch dimmer, and warm ambient lighting perfect for modern interiors.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80',
    category: 'Home & Living',
    stock: 18,
    rating: 4.6,
    numReviews: 34
  },
  {
    name: 'Organic Cotton Throw Blanket',
    description: 'GOTS-certified organic cotton throw in a chunky waffle weave pattern. Generously sized at 60"x80", pre-washed for ultimate softness, and available in earthy neutral tones.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
    category: 'Home & Living',
    stock: 40,
    rating: 4.8,
    numReviews: 112
  },
  {
    name: 'Pour-Over Coffee Maker Set',
    description: 'Complete pour-over brewing set including borosilicate glass carafe, stainless steel reusable filter, gooseneck kettle, and hand-ground coffee scoop. Brews 4 cups of café-quality coffee.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80',
    category: 'Home & Living',
    stock: 30,
    rating: 4.4,
    numReviews: 87
  },
  {
    name: 'Scented Soy Candle',
    description: 'Hand-poured 100% soy wax candle with essential oils. Notes of sandalwood, amber, and vanilla. Burns cleanly for up to 60 hours.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80',
    category: 'Home & Living',
    stock: 95,
    rating: 4.9,
    numReviews: 250
  },
  {
    name: 'Minimalist Ceramic Planter',
    description: 'Sleek and modern ceramic planter with a matte finish and hidden drainage system. Perfect for indoor houseplants and succulents.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80',
    category: 'Home & Living',
    stock: 65,
    rating: 4.7,
    numReviews: 145
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert seed data
    const inserted = await Product.insertMany(products);
    console.log(`🌱 Seeded ${inserted.length} products successfully!`);

    console.log('\nSeeded products:');
    inserted.forEach(p => {
      console.log(`   • ${p.name} — $${p.price} [${p.category}]`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();

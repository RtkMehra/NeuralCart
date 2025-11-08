import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/data-source';
import { Category } from '../entities/Category';
import { Order, OrderStatus } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Product } from '../entities/Product';
import { User } from '../entities/User';
import { logger } from '../lib/logger';
import { initSearch, searchService } from '../lib/search';
import { recommendationService } from '../lib/recommendation';

const categoriesSeed = [
  { name: 'Smart Devices', slug: 'smart-devices' },
  { name: 'Home & Office', slug: 'home-office' },
  { name: 'Health & Wellness', slug: 'health-wellness' },
  { name: 'Outdoor & Adventure', slug: 'outdoor-adventure' }
];

const baseProductsSeed = [
  {
    name: 'NeuroBand Sleep Tracker',
    description:
      'Wearable sleep tracker with neural feedback to improve sleep quality.',
    price: 199.99,
    stock: 50,
    categorySlug: 'health-wellness'
  },
  {
    name: 'Cortex Desk Lamp',
    description: 'Smart lamp that adjusts brightness based on proximity sensing.',
    price: 129.0,
    stock: 35,
    categorySlug: 'home-office'
  },
  {
    name: 'Atlas Standing Desk',
    description: 'Ergonomic standing desk with memory presets and cable management.',
    price: 699.5,
    stock: 20,
    categorySlug: 'home-office'
  },
  {
    name: 'Trailblazer Solar Pack',
    description: 'Solar-powered backpack with modular battery system.',
    price: 249.99,
    stock: 15,
    categorySlug: 'outdoor-adventure'
  },
  {
    name: 'NeuralKettle',
    description: 'Smart kettle that learns your ideal brew temperature.',
    price: 89.99,
    stock: 60,
    categorySlug: 'home-office'
  },
  {
    name: 'PulseFit Trainer',
    description: 'AI-guided fitness tracker with adaptive workout plans.',
    price: 179.99,
    stock: 45,
    categorySlug: 'health-wellness'
  },
  {
    name: 'SonicShield Earbuds',
    description: 'Noise-cancelling earbuds tuned for focus environments.',
    price: 149.99,
    stock: 80,
    categorySlug: 'smart-devices'
  },
  {
    name: 'Momentum Bike Computer',
    description: 'GPS-enabled cycling computer with live route optimization.',
    price: 229.99,
    stock: 30,
    categorySlug: 'outdoor-adventure'
  },
  {
    name: 'Aurora Smart Bulb Set',
    description: 'Adaptive lighting kit with circadian rhythm scheduling.',
    price: 99.99,
    stock: 100,
    categorySlug: 'smart-devices'
  },
  {
    name: 'FocusPod',
    description: 'Portable acoustic pod for deep work sessions.',
    price: 329.99,
    stock: 12,
    categorySlug: 'home-office'
  },
  {
    name: 'Hydra Infusion Bottle',
    description: 'Self-cleaning bottle with electrolytic infusion system.',
    price: 59.99,
    stock: 90,
    categorySlug: 'health-wellness'
  },
  {
    name: 'NeuralCart Gift Card',
    description: 'Digital gift card redeemable for any NeuralCart product.',
    price: 50.0,
    stock: 999,
    categorySlug: 'smart-devices'
  },
  {
    name: 'Borealis Trail Jacket',
    description: 'All-weather jacket with thermal adaptive lining.',
    price: 189.99,
    stock: 25,
    categorySlug: 'outdoor-adventure'
  },
  {
    name: 'PulseMat Yoga Companion',
    description: 'Smart yoga mat with pose correction feedback.',
    price: 139.99,
    stock: 40,
    categorySlug: 'health-wellness'
  },
  {
    name: 'Orbit Home Hub',
    description: 'Central home automation hub with edge AI processing.',
    price: 259.99,
    stock: 28,
    categorySlug: 'smart-devices'
  },
  {
    name: 'Summit Thermal Flask',
    description: 'Vacuum insulated flask with temperature indicator.',
    price: 44.99,
    stock: 110,
    categorySlug: 'outdoor-adventure'
  },
  {
    name: 'Aurora Panel Set',
    description: 'Modular wall panels for immersive ambient lighting.',
    price: 199.99,
    stock: 65,
    categorySlug: 'smart-devices'
  },
  {
    name: 'SyncDesk Organizer',
    description: 'Magnetic desk organizer with wireless charging pad.',
    price: 79.99,
    stock: 70,
    categorySlug: 'home-office'
  },
  {
    name: 'Clarity Air Purifier',
    description: 'Quiet air purifier with pollen and allergen sensors.',
    price: 219.99,
    stock: 33,
    categorySlug: 'home-office'
  },
  {
    name: 'ZenPulse Massager',
    description: 'Portable percussion massager with adaptive intensity.',
    price: 159.99,
    stock: 55,
    categorySlug: 'health-wellness'
  }
];

const generatedProductsSeed = Array.from({ length: 80 }, (_, index) => {
  const id = index + 1;
  const category = categoriesSeed[index % categoriesSeed.length];

  return {
    name: `NeuralCart Series ${id.toString().padStart(3, '0')}`,
    description: `Limited-run ${category.name.toLowerCase()} product engineered for the Singularity showcase (batch ${id}).`,
    price: 49.99 + (index % 10) * 25,
    stock: 25 + (index % 40),
    categorySlug: category.slug
  };
});

const productsSeed = [...baseProductsSeed, ...generatedProductsSeed];

const usersSeed = [
  {
    email: 'demo@neuralcart.dev',
    name: 'Demo Customer',
    password: 'demo123'
  },
  {
    email: 'jane@neuralcart.dev',
    name: 'Jane Neural',
    password: 'neural123'
  }
];

const run = async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  await initSearch();

  const categoryRepo = AppDataSource.getRepository(Category);
  const productRepo = AppDataSource.getRepository(Product);
  const userRepo = AppDataSource.getRepository(User);
  const orderRepo = AppDataSource.getRepository(Order);
  const orderItemRepo = AppDataSource.getRepository(OrderItem);

  await AppDataSource.query(
    'TRUNCATE TABLE "order_items", "orders", "products", "categories", "users" RESTART IDENTITY CASCADE'
  );

  const categories = await categoryRepo.save(
    categoriesSeed.map((category) => categoryRepo.create(category))
  );

  const categoryMap = new Map(categories.map((category) => [category.slug, category]));

  const users = await Promise.all(
    usersSeed.map(async (user) =>
      userRepo.save(
        userRepo.create({
          email: user.email,
          name: user.name,
          passwordHash: await bcrypt.hash(user.password, 10)
        })
      )
    )
  );

  const products = await productRepo.save(
    productsSeed.map((product) =>
      productRepo.create({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: categoryMap.get(product.categorySlug)!,
        imageUrl: null
      })
    )
  );

  if (searchService.isEnabled()) {
    await searchService.reindexProducts(products);
  }

  await recommendationService.reindexEmbeddings();

  const demoOrder = orderRepo.create({
    user: users[0],
    status: OrderStatus.PAID,
    totalAmount: 0,
    items: []
  });

  const demoItems = [
    { product: products[0], quantity: 1 },
    { product: products[6], quantity: 2 }
  ];

  let total = 0;

  for (const item of demoItems) {
    const orderItem = orderItemRepo.create({
      order: demoOrder,
      product: item.product,
      quantity: item.quantity,
      unitPrice: item.product.price
    });

    total += item.product.price * item.quantity;
    demoOrder.items.push(orderItem);
  }

  demoOrder.totalAmount = Number(total.toFixed(2));

  await orderRepo.save(demoOrder);

  // eslint-disable-next-line no-console
  logger.info('Seed completed successfully');
};

run()
  .catch((error) => {
    logger.error({ err: error }, 'Seed failed');
    process.exit(1);
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });


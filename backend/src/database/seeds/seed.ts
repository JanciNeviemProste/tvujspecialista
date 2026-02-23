import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import {
  Specialist,
  SpecialistCategory,
  SubscriptionTier,
} from '../entities/specialist.entity';
import { Review } from '../entities/review.entity';
import { Event, EventType, EventFormat, EventCategory, EventStatus } from '../entities/event.entity';
import { ForumCategory } from '../entities/forum-category.entity';
import { ForumTopic } from '../entities/forum-topic.entity';
import { ForumPost } from '../entities/forum-post.entity';

// Mock specialists data (imported from frontend mocks)
const mockSpecialists = [
  {
    id: '1',
    slug: 'jan-novak-financni-poradce-praha',
    name: 'Jan Novák',
    email: 'jan.novak@example.cz',
    phone: '+420 777 123 456',
    photo: '/images/placeholder-avatar.png',
    verified: true,
    topSpecialist: true,
    category: 'Finanční poradce',
    location: 'Praha',
    bio: 'Komplexní finanční poradenství přes 10 let. Pomohl jsem stovkám klientů s hypotékami, pojištěním a investicemi. Specializuji se na refinancování, životní pojištění a budování investičního portfolia.',
    yearsExperience: 10,
    hourlyRate: 800,
    rating: 4.9,
    reviewsCount: 47,
    services: [
      'Hypotéky a refinancování',
      'Životní pojištění',
      'Investiční strategie',
      'Finanční plánování',
    ],
    certifications: [
      'Certifikovaný hypoteční poradce',
      'Finanční analytik',
      'Pojišťovací makléř',
    ],
    education: 'VŠE Praha, Finance a účetnictví',
    website: 'https://finance-novak.cz',
    linkedin: 'https://linkedin.com/in/jannovak',
    availability: ['Po', 'Út', 'St', 'Čt', 'Pá'],
    subscriptionTier: 'premium',
  },
  {
    id: '2',
    slug: 'petra-svobodova-financni-poradce-brno',
    name: 'Petra Svobodová',
    email: 'petra.svobodova@example.cz',
    phone: '+420 608 234 567',
    photo: '/images/placeholder-avatar.png',
    verified: true,
    topSpecialist: false,
    category: 'Finanční poradce',
    location: 'Brno',
    bio: 'Finanční poradkyně s 8 lety praxe. Pomohu vám s komplexním finančním plánováním - od pojištění přes hypotéky až po penzijní připojištění. Individuální přístup ke každému klientovi.',
    yearsExperience: 8,
    hourlyRate: 600,
    rating: 4.8,
    reviewsCount: 32,
    services: [
      'Životní pojištění',
      'Hypotéky',
      'Penzijní připojištění',
      'Investice a spoření',
    ],
    certifications: [
      'Certifikovaný pojišťovací makléř',
      'Hypoteční specialista',
    ],
    education: 'Masarykova univerzita, Ekonomie',
    website: 'https://finance-svobodova.cz',
    availability: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
    subscriptionTier: 'pro',
  },
  {
    id: '3',
    slug: 'martin-dvorak-financni-poradce-praha',
    name: 'Martin Dvořák',
    email: 'martin.dvorak@example.cz',
    phone: '+420 723 345 678',
    photo: '/images/placeholder-avatar.png',
    verified: true,
    topSpecialist: true,
    category: 'Finanční poradce',
    location: 'Praha',
    bio: 'Finanční poradce s mezinárodními zkušenostmi. Komplexní finanční řešení včetně investic, pojištění a hypotéčního poradenství. Specializuji se na tvorbu investičních portfolií a dlouhodobé finanční plánování.',
    yearsExperience: 12,
    hourlyRate: 1200,
    rating: 4.9,
    reviewsCount: 63,
    services: [
      'Investiční strategie',
      'Portfolio management',
      'Hypotéky a úvěry',
      'Pojištění majetku',
    ],
    certifications: [
      'CFA charterholder',
      'Certifikovaný finanční poradce',
      'Hypoteční poradce',
    ],
    education: 'VŠE Praha, Finanční trhy',
    website: 'https://finance-dvorak.cz',
    linkedin: 'https://linkedin.com/in/martindvorak',
    availability: ['Po', 'Út', 'St', 'Čt'],
    subscriptionTier: 'premium',
  },
  {
    id: '4',
    slug: 'lucie-novotna-realitni-makler-ostrava',
    name: 'Lucie Novotná',
    email: 'lucie.novotna@example.cz',
    phone: '+420 734 456 789',
    photo: '/images/placeholder-avatar.png',
    verified: true,
    topSpecialist: false,
    category: 'Realitní makléř',
    location: 'Ostrava',
    bio: 'Realitní makléřka se specializací na prodej bytů a rodinných domů. Za svou kariéru jsem úspěšně zprostředkovala přes 150 transakcí. Znám ostravský trh důkladně.',
    yearsExperience: 6,
    hourlyRate: 0,
    rating: 4.7,
    reviewsCount: 28,
    services: [
      'Prodej bytů',
      'Prodej domů',
      'Pronájem nemovitostí',
      'Odhad tržní ceny',
    ],
    certifications: ['Certifikovaný realitní makléř'],
    education: 'VŠB TU Ostrava, Management',
    website: 'https://reality-novotna.cz',
    facebook: 'https://facebook.com/realitynovotna',
    availability: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
    subscriptionTier: 'pro',
  },
  {
    id: '6',
    slug: 'katerina-mala-financni-poradce-brno',
    name: 'Kateřina Malá',
    email: 'katerina.mala@example.cz',
    phone: '+420 739 678 901',
    photo: '/images/placeholder-avatar.png',
    verified: false,
    topSpecialist: false,
    category: 'Finanční poradce',
    location: 'Brno',
    bio: 'Finanční poradkyně zaměřená na mladé rodiny. Pomohu vám s první hypotékou, pojištěním rodiny a nastavením rodinného rozpočtu. Ráda vám pomůžu zorientovat se ve finančním plánování.',
    yearsExperience: 4,
    hourlyRate: 500,
    rating: 4.6,
    reviewsCount: 15,
    services: [
      'Hypotéky pro mladé',
      'Životní pojištění',
      'Rodinné finance',
      'Státní podpora',
    ],
    certifications: ['Hypoteční specialista', 'Pojišťovací poradce'],
    education: 'Masarykova univerzita, Finance',
    availability: ['Po', 'Út', 'St', 'Čt', 'Pá'],
    subscriptionTier: 'basic',
  },
  {
    id: '7',
    slug: 'jan-kral-financni-poradce-praha',
    name: 'Jan Král',
    email: 'jan.kral@example.cz',
    phone: '+420 775 789 012',
    photo: '/images/placeholder-avatar.png',
    verified: true,
    topSpecialist: true,
    category: 'Finanční poradce',
    location: 'Praha',
    bio: 'Komplexní finanční služby pro firmy i jednotlivce. Specializuji se na finanční plánování pro podnikatele, pojištění a optimalizaci finančních nákladů. Více než 20 let zkušeností v oboru.',
    yearsExperience: 20,
    hourlyRate: 900,
    rating: 4.8,
    reviewsCount: 56,
    services: [
      'Finanční plánování pro firmy',
      'Podnikatelské pojištění',
      'Hypotéky a úvěry',
      'Investiční poradenství',
    ],
    certifications: [
      'Senior finanční konzultant',
      'Risk manager',
      'Pojišťovací makléř',
    ],
    education: 'VŠE Praha, Pojišťovnictví',
    website: 'https://finance-kral.cz',
    linkedin: 'https://linkedin.com/in/jankral',
    availability: ['Po', 'Út', 'St', 'Čt', 'Pá'],
    subscriptionTier: 'premium',
  },
  {
    id: '8',
    slug: 'michaela-vesela-realitni-makler-praha',
    name: 'Michaela Veselá',
    email: 'michaela.vesela@example.cz',
    phone: '+420 732 890 123',
    photo: '/images/placeholder-avatar.png',
    verified: true,
    topSpecialist: false,
    category: 'Realitní makléř',
    location: 'Praha',
    bio: 'Luxusní nemovitosti v Praze jsou mou specializací. Pomohu vám najít váš vysněný domov nebo prodat nemovitost za nejlepší cenu. Individuální přístup ke každému klientovi.',
    yearsExperience: 7,
    hourlyRate: 0,
    rating: 4.9,
    reviewsCount: 39,
    services: [
      'Luxusní nemovitosti',
      'Prodej bytů Praha',
      'Investiční nemovitosti',
      'VIP služby',
    ],
    certifications: [
      'Certifikovaný realitní makléř',
      'Luxury property specialist',
    ],
    education: 'VŠCHT Praha, Marketing',
    website: 'https://reality-vesela.cz',
    instagram: 'https://instagram.com/realityvesela',
    availability: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
    subscriptionTier: 'pro',
  },
  {
    id: '9',
    slug: 'pavel-horak-financni-poradce-brno',
    name: 'Pavel Horák',
    email: 'pavel.horak@example.cz',
    phone: '+420 724 901 234',
    photo: '/images/placeholder-avatar.png',
    verified: true,
    topSpecialist: false,
    category: 'Finanční poradce',
    location: 'Brno',
    bio: 'Finanční poradce pro začínající investory a mladé rodiny. Pomohu vám udělat první kroky k finanční nezávislosti - investice, pojištění i hypotéky. Jednoduché vysvětlení složitých věcí.',
    yearsExperience: 5,
    hourlyRate: 600,
    rating: 4.7,
    reviewsCount: 22,
    services: [
      'Investice pro začátečníky',
      'První hypotéka',
      'Životní pojištění',
      'Finanční plánování',
    ],
    certifications: ['Certifikovaný finanční poradce'],
    education: 'Masarykova univerzita, Finance',
    website: 'https://finance-horak.cz',
    availability: ['Po', 'St', 'Čt', 'Pá'],
    subscriptionTier: 'basic',
  },
];

async function seed() {
  // Initialize database connection
  const databaseUrl = process.env.DATABASE_URL;

  const connectionConfig = databaseUrl
    ? {
        type: 'postgres' as const,
        url: databaseUrl,
        ssl: { rejectUnauthorized: false },
      }
    : {
        type: 'postgres' as const,
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        database: process.env.DATABASE_NAME || 'tvujspecialista',
      };

  const dataSource = new DataSource({
    ...connectionConfig,
    entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Database connected');

  const userRepository = dataSource.getRepository(User);
  const specialistRepository = dataSource.getRepository(Specialist);
  const reviewRepository = dataSource.getRepository(Review);

  // 1. Create admin user
  console.log('Creating admin user...');
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@tvujspecialista.cz' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const admin = userRepository.create({
      email: 'admin@tvujspecialista.cz',
      password: hashedPassword,
      role: UserRole.ADMIN,
      name: 'Admin',
      phone: '+420 123 456 789',
      verified: true,
    });
    await userRepository.save(admin);
    console.log('Admin user created:', admin.email);
  } else {
    console.log('Admin user already exists');
  }

  // 2. Create specialists from mock data
  console.log('\nCreating specialists...');
  for (const mock of mockSpecialists) {
    // Check if specialist already exists
    const existing = await specialistRepository.findOne({
      where: { email: mock.email },
    });
    if (existing) {
      console.log(`Specialist ${mock.name} already exists, skipping...`);
      continue;
    }

    // Create user for specialist
    const hashedPassword = await bcrypt.hash('Specialist123!', 10);
    const user = userRepository.create({
      email: mock.email,
      password: hashedPassword,
      role: UserRole.SPECIALIST,
      name: mock.name,
      phone: mock.phone || '+420123456789',
      verified: mock.verified,
    });
    await userRepository.save(user);

    // Create specialist profile
    // Map category string to enum
    const category =
      mock.category === 'Finanční poradce'
        ? SpecialistCategory.FINANCIAL_ADVISOR
        : SpecialistCategory.REAL_ESTATE_AGENT;

    // Map subscription tier string to enum
    const tier =
      mock.subscriptionTier === 'basic'
        ? SubscriptionTier.BASIC
        : mock.subscriptionTier === 'pro'
          ? SubscriptionTier.PRO
          : SubscriptionTier.PREMIUM;

    const specialist = specialistRepository.create({
      userId: user.id,
      slug: mock.slug,
      name: mock.name,
      email: mock.email,
      phone: mock.phone || '+420123456789',
      photo: mock.photo,
      verified: mock.verified,
      topSpecialist: mock.topSpecialist,
      category: category,
      location: mock.location,
      bio: mock.bio,
      yearsExperience: mock.yearsExperience,
      hourlyRate: mock.hourlyRate,
      rating: mock.rating,
      reviewsCount: mock.reviewsCount,
      services: mock.services,
      certifications: mock.certifications,
      education: mock.education,
      website: mock.website,
      linkedin: mock.linkedin || undefined,
      facebook: (mock as Record<string, unknown>).facebook as
        | string
        | undefined,
      instagram: (mock as Record<string, unknown>).instagram as
        | string
        | undefined,
      availability: mock.availability,
      subscriptionTier: tier,
      leadCount: 0,
    });
    await specialistRepository.save(specialist);
    console.log(`Specialist created: ${specialist.name}`);

    // 3. Create sample reviews for each specialist
    if (mock.reviewsCount > 0) {
      const reviewTexts = [
        'Velmi profesionální přístup, doporučuji!',
        'Skvělá komunikace a vynikající výsledky. Děkuji za pomoc!',
        'Odbornost na nejvyšší úrovni. Pomohl mi vyřešit složitou situaci.',
        'Rychlá odezva a individuální přístup. Mohu jen doporučit.',
        'Perfektní servis, všechno proběhlo hladce a bez problémů.',
      ];

      const customerNames = [
        'Jan Novák',
        'Marie Dvořáková',
        'Petr Svoboda',
        'Jana Malá',
        'Tomáš Veselý',
      ];

      // Create 2-3 sample reviews
      const reviewCount = Math.min(
        3,
        Math.max(2, Math.floor(mock.reviewsCount / 15)),
      );
      for (let i = 0; i < reviewCount; i++) {
        await reviewRepository.save({
          specialistId: specialist.id,
          customerName: customerNames[i % customerNames.length],
          customerEmail: `customer${i}@example.com`,
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
          comment: reviewTexts[i % reviewTexts.length],
          verified: true,
          published: true,
        });
      }
      console.log(`  Created ${reviewCount} sample reviews`);
    }
  }

  // 4. Create community events
  console.log('\nCreating community events...');
  const eventRepository = dataSource.getRepository(Event);
  const existingEvents = await eventRepository.count();

  if (existingEvents === 0) {
    const admin = await userRepository.findOne({ where: { email: 'admin@tvujspecialista.cz' } });

    const now = new Date();
    const events = [
      {
        slug: 'networking-praha-financni-poradci',
        title: 'Networking Praha — Finanční poradci',
        description: 'Setkání finančních poradců v Praze. Sdílení zkušeností, best practices a navazování kontaktů. Přijďte se potkat s kolegy z oboru!',
        type: EventType.NETWORKING,
        format: EventFormat.OFFLINE,
        category: EventCategory.FINANCIAL,
        startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        location: 'Praha',
        address: 'Kavárna Slavia, Smetanovo nábřeží 2, Praha 1',
        organizerId: admin!.id,
        maxAttendees: 30,
        price: 0,
        status: EventStatus.PUBLISHED,
        published: true,
        tags: ['networking', 'finance', 'praha'],
      },
      {
        slug: 'workshop-hypoteky-2026',
        title: 'Workshop: Hypotéky v roce 2026',
        description: 'Online workshop zaměřený na aktuální trendy v hypotečním trhu. Dozvíte se o nových regulacích, úrokových sazbách a jak nejlépe poradit klientům.',
        type: EventType.WORKSHOP,
        format: EventFormat.ONLINE,
        category: EventCategory.FINANCIAL,
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        meetingLink: 'https://meet.google.com/example',
        organizerId: admin!.id,
        maxAttendees: 100,
        price: 0,
        status: EventStatus.PUBLISHED,
        published: true,
        tags: ['workshop', 'hypotéky', 'online'],
      },
      {
        slug: 'konference-realitni-trh-brno',
        title: 'Konference: Realitní trh Moravy',
        description: 'Celodenní konference o realitním trhu na Moravě. Přednášky od špičkových odborníků, panelové diskuze a prostor pro networking.',
        type: EventType.CONFERENCE,
        format: EventFormat.OFFLINE,
        category: EventCategory.REAL_ESTATE,
        startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        location: 'Brno',
        address: 'Hotel International, Husova 16, Brno',
        organizerId: admin!.id,
        maxAttendees: 200,
        price: 500,
        status: EventStatus.PUBLISHED,
        published: true,
        featured: true,
        tags: ['konference', 'reality', 'brno', 'morava'],
      },
    ];

    for (const eventData of events) {
      await eventRepository.save(eventData);
      console.log(`Event created: ${eventData.title}`);
    }
  } else {
    console.log('Events already exist, skipping...');
  }

  // 5. Create forum categories and topics
  console.log('\nCreating forum categories and topics...');
  const forumCategoryRepository = dataSource.getRepository(ForumCategory);
  const forumTopicRepository = dataSource.getRepository(ForumTopic);
  const forumPostRepository = dataSource.getRepository(ForumPost);
  const existingCategories = await forumCategoryRepository.count();

  if (existingCategories === 0) {
    const admin = await userRepository.findOne({ where: { email: 'admin@tvujspecialista.cz' } });
    const specialist1 = await userRepository.findOne({ where: { email: 'jan.novak@example.cz' } });
    const specialist2 = await userRepository.findOne({ where: { email: 'petra.svobodova@example.cz' } });

    // Create categories
    const categories = [
      {
        name: 'Finanční poradenství',
        slug: 'financni-poradenstvi',
        description: 'Diskuze o finančním poradenství, hypotékách, pojištění a investicích',
        icon: 'Wallet',
        position: 1,
      },
      {
        name: 'Reality a nemovitosti',
        slug: 'reality-a-nemovitosti',
        description: 'Diskuze o realitním trhu, prodeji a pronájmu nemovitostí',
        icon: 'Home',
        position: 2,
      },
      {
        name: 'Obecná diskuze',
        slug: 'obecna-diskuze',
        description: 'Ostatní témata, tipy a triky, představování se',
        icon: 'MessageSquare',
        position: 3,
      },
    ];

    for (const catData of categories) {
      const category = await forumCategoryRepository.save(catData);
      console.log(`Forum category created: ${category.name}`);
    }

    // Create topics
    const financeCategory = await forumCategoryRepository.findOne({ where: { slug: 'financni-poradenstvi' } });
    const realityCategory = await forumCategoryRepository.findOne({ where: { slug: 'reality-a-nemovitosti' } });
    const generalCategory = await forumCategoryRepository.findOne({ where: { slug: 'obecna-diskuze' } });

    const topics = [
      {
        categoryId: financeCategory!.id,
        authorId: specialist1!.id,
        title: 'Jaké jsou nejlepší strategie pro refinancování v roce 2026?',
        slug: 'strategie-refinancovani-2026',
        content: 'Ahoj všichni, chtěl bych se zeptat na vaše zkušenosti s refinancováním hypoték v letošním roce. Úrokové sazby se mění a klienti se ptají na nejlepší přístup. Jaké strategie používáte?',
        isPinned: true,
      },
      {
        categoryId: financeCategory!.id,
        authorId: specialist2!.id,
        title: 'Pojištění pro mladé rodiny — co doporučujete?',
        slug: 'pojisteni-mlade-rodiny',
        content: 'Mám stále více klientů z řad mladých rodin. Jaké produkty jim doporučujete? Životní pojištění, úrazové, nebo spíše investiční životní pojištění?',
      },
      {
        categoryId: realityCategory!.id,
        authorId: admin!.id,
        title: 'Trendy na pražském realitním trhu',
        slug: 'trendy-prazsky-realitni-trh',
        content: 'Jaké jsou vaše postřehy ohledně aktuálního stavu pražského realitního trhu? Ceny bytů, poptávka, jak se mění situace?',
      },
      {
        categoryId: generalCategory!.id,
        authorId: admin!.id,
        title: 'Vítejte na fóru tvujspecialista.cz!',
        slug: 'vitejte-na-foru',
        content: 'Vítejte na našem komunitním fóru! Toto je místo pro sdílení zkušeností, rad a diskuzí mezi finančními poradci a realitními makléři. Představte se a řekněte nám o sobě!',
        isPinned: true,
      },
    ];

    for (const topicData of topics) {
      const topic = await forumTopicRepository.save(topicData);
      console.log(`Forum topic created: ${topic.title}`);

      // Add replies
      if (topicData.slug === 'strategie-refinancovani-2026') {
        await forumPostRepository.save({
          topicId: topic.id,
          authorId: specialist2!.id,
          content: 'Skvělé téma! My doporučujeme klientům porovnat nabídky minimálně od 3 bank. Hodně záleží na LTV a fixaci. U klientů s LTV pod 60% se dá vyjednat výrazná sleva.',
        });
        await forumPostRepository.save({
          topicId: topic.id,
          authorId: admin!.id,
          content: 'Souhlasím s Petrou. Také bych dodal, že je důležité počítat s celkovými náklady refinancování — poplatky za předčasné splacení, odhad nemovitosti atd.',
        });
        await forumTopicRepository.update(topic.id, { replyCount: 2 });
      }

      if (topicData.slug === 'vitejte-na-foru') {
        await forumPostRepository.save({
          topicId: topic.id,
          authorId: specialist1!.id,
          content: 'Ahoj, jsem Jan Novák, finanční poradce z Prahy. Rád se tu setkávám s kolegy z oboru. Těším se na zajímavé diskuze!',
        });
        await forumTopicRepository.update(topic.id, { replyCount: 1 });
      }
    }

    // Update topic counts
    await forumCategoryRepository.update(financeCategory!.id, { topicCount: 2 });
    await forumCategoryRepository.update(realityCategory!.id, { topicCount: 1 });
    await forumCategoryRepository.update(generalCategory!.id, { topicCount: 1 });
  } else {
    console.log('Forum categories already exist, skipping...');
  }

  console.log('\n✅ Seeding completed successfully!');
  console.log('\nLogin credentials:');
  console.log('Admin: admin@tvujspecialista.cz / Admin123!');
  console.log('Specialists: {specialist-email} / Specialist123!');

  await dataSource.destroy();
}

seed()
  .then(() => {
    console.log('\nSeed script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });

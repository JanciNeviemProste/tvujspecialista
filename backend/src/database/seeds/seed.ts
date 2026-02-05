import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { Specialist, SpecialistCategory, SubscriptionTier } from '../entities/specialist.entity';
import { Review } from '../entities/review.entity';

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
    services: ['Hypotéky a refinancování', 'Životní pojištění', 'Investiční strategie', 'Finanční plánování'],
    certifications: ['Certifikovaný hypoteční poradce', 'Finanční analytik', 'Pojišťovací makléř'],
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
    services: ['Životní pojištění', 'Hypotéky', 'Penzijní připojištění', 'Investice a spoření'],
    certifications: ['Certifikovaný pojišťovací makléř', 'Hypoteční specialista'],
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
    services: ['Investiční strategie', 'Portfolio management', 'Hypotéky a úvěry', 'Pojištění majetku'],
    certifications: ['CFA charterholder', 'Certifikovaný finanční poradce', 'Hypoteční poradce'],
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
    services: ['Prodej bytů', 'Prodej domů', 'Pronájem nemovitostí', 'Odhad tržní ceny'],
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
    services: ['Hypotéky pro mladé', 'Životní pojištění', 'Rodinné finance', 'Státní podpora'],
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
    services: ['Finanční plánování pro firmy', 'Podnikatelské pojištění', 'Hypotéky a úvěry', 'Investiční poradenství'],
    certifications: ['Senior finanční konzultant', 'Risk manager', 'Pojišťovací makléř'],
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
    services: ['Luxusní nemovitosti', 'Prodej bytů Praha', 'Investiční nemovitosti', 'VIP služby'],
    certifications: ['Certifikovaný realitní makléř', 'Luxury property specialist'],
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
    services: ['Investice pro začátečníky', 'První hypotéka', 'Životní pojištění', 'Finanční plánování'],
    certifications: ['Certifikovaný finanční poradce'],
    education: 'Masarykova univerzita, Finance',
    website: 'https://finance-horak.cz',
    availability: ['Po', 'St', 'Čt', 'Pá'],
    subscriptionTier: 'basic',
  },
];

async function seed() {
  // Initialize database connection
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'tvujspecialista',
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
  const existingAdmin = await userRepository.findOne({ where: { email: 'admin@tvujspecialista.cz' } });

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
    const existing = await specialistRepository.findOne({ where: { email: mock.email } });
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
    const category = mock.category === 'Finanční poradce'
      ? SpecialistCategory.FINANCIAL_ADVISOR
      : SpecialistCategory.REAL_ESTATE_AGENT;

    // Map subscription tier string to enum
    const tier = mock.subscriptionTier === 'basic' ? SubscriptionTier.BASIC
      : mock.subscriptionTier === 'pro' ? SubscriptionTier.PRO
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
      facebook: (mock as any).facebook || undefined,
      instagram: (mock as any).instagram || undefined,
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
      const reviewCount = Math.min(3, Math.max(2, Math.floor(mock.reviewsCount / 15)));
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

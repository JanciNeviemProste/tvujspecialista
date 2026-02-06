import { DataSource } from 'typeorm';
import {
  Event,
  EventType,
  EventFormat,
  EventCategory,
  EventStatus,
} from '../entities/event.entity';
import { User, UserRole } from '../entities/user.entity';

export async function seedCommunityEvents(dataSource: DataSource) {
  const eventRepository = dataSource.getRepository(Event);
  const userRepository = dataSource.getRepository(User);

  console.log('🌱 Seeding community events...');

  // Find or create an organizer user
  let organizer = await userRepository.findOne({
    where: { email: 'organizer@tvujspecialista.cz' },
  });

  if (!organizer) {
    organizer = userRepository.create({
      email: 'organizer@tvujspecialista.cz',
      password: 'hashed_password_placeholder',
      name: 'Jan Organizátor',
      phone: '+420 777 888 999',
      role: UserRole.ADMIN,
      verified: true,
    });
    organizer = await userRepository.save(organizer);
  }

  // Sample Events
  const events = [
    {
      slug: 'webinar-hypoteky-2026-tipy-a-triky',
      title: 'Webinář: Hypotéky v roce 2026 - Tipy a triky',
      description: `Online webinář zaměřený na aktuální trendy v oblasti hypotečního financování. Probereme:
- Aktuální úrokové sazby a prognózy
- Nejčastější chyby klientů při žádosti o hypotéku
- Jak poradit klientům s výběrem správné hypotéky
- Q&A session

Ideální pro začínající i pokročilé hypoteční poradce.`,
      type: EventType.WEBINAR,
      format: EventFormat.ONLINE,
      category: EventCategory.FINANCIAL,
      bannerImage: '/images/events/webinar-hypoteky-2026.jpg',
      startDate: new Date('2026-03-15T18:00:00'),
      endDate: new Date('2026-03-15T20:00:00'),
      timezone: 'Europe/Prague',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      meetingPassword: 'hypoteky2026',
      organizerId: organizer.id,
      maxAttendees: 100,
      attendeeCount: 0,
      price: 0,
      currency: 'CZK',
      status: EventStatus.PUBLISHED,
      published: true,
      featured: true,
      tags: ['hypotéky', 'finance', 'webinář', 'online'],
    },
    {
      slug: 'networking-reality-praha-brezen',
      title: 'Realitní Networking - Praha',
      description: `Networkingová akce pro realitní makléře v Praze. Přijďte se setkat s kolegy, vyměnit si zkušenosti a navázat nové obchodní kontakty.

Program:
- 18:00 - 18:30 Příchod a registrace
- 18:30 - 19:00 Úvodní prezentace
- 19:00 - 21:00 Volný networking
- 21:00 - 22:00 Neformální posezení

Kapacita je omezená na 50 účastníků.`,
      type: EventType.NETWORKING,
      format: EventFormat.OFFLINE,
      category: EventCategory.REAL_ESTATE,
      bannerImage: '/images/events/networking-reality-praha.jpg',
      startDate: new Date('2026-03-20T18:00:00'),
      endDate: new Date('2026-03-20T22:00:00'),
      timezone: 'Europe/Prague',
      location: 'Impact Hub Prague',
      address: 'Drtinova 10, 150 00 Praha 5',
      latitude: 50.0755,
      longitude: 14.4378,
      organizerId: organizer.id,
      maxAttendees: 50,
      attendeeCount: 0,
      price: 500,
      currency: 'CZK',
      status: EventStatus.PUBLISHED,
      published: true,
      featured: true,
      tags: ['networking', 'reality', 'praha', 'offline'],
    },
    {
      slug: 'workshop-investicni-poradenstvi-brno',
      title: 'Workshop: Investiční poradenství pro začátečníky',
      description: `Celodenní workshop v Brně zaměřený na základy investičního poradenství.

Co se naučíte:
- Základy investičních nástrojů (akcie, dluhopisy, ETF)
- Jak sestavit portfolio podle rizikového profilu klienta
- Daňová optimalizace investic
- Praktické případové studie
- Regulace a compliance

Workshop vede Ing. Jan Král, MBA - investiční specialista s 20 lety zkušeností.

Součástí je oběd a coffee break.`,
      type: EventType.WORKSHOP,
      format: EventFormat.OFFLINE,
      category: EventCategory.FINANCIAL,
      bannerImage: '/images/events/workshop-investice-brno.jpg',
      startDate: new Date('2026-04-05T09:00:00'),
      endDate: new Date('2026-04-05T17:00:00'),
      timezone: 'Europe/Prague',
      location: 'Venue Brno',
      address: 'Radnická 2, 602 00 Brno',
      latitude: 49.1951,
      longitude: 16.6068,
      organizerId: organizer.id,
      maxAttendees: 30,
      attendeeCount: 0,
      price: 2500,
      currency: 'CZK',
      status: EventStatus.PUBLISHED,
      published: true,
      featured: false,
      tags: ['workshop', 'investice', 'brno', 'offline'],
    },
    {
      slug: 'konference-budoucnost-realit-2026',
      title: 'Konference: Budoucnost realit 2026',
      description: `Největší realitní konference roku! Dvoudenní akce plná inspirace, vzdělávání a networkingu.

Den 1 - Trendy a strategie:
- Digitalizace realitního trhu
- AI a automatizace v realitách
- Udržitelné bydlení
- Panel diskuze s top makléři

Den 2 - Praktické workshopy:
- Marketing pro realitní makléře
- Vyjednávací techniky
- Právní minimum
- Osobní branding

Účast včetně obědů, coffee breaks a večerního networking eventu.`,
      type: EventType.CONFERENCE,
      format: EventFormat.OFFLINE,
      category: EventCategory.REAL_ESTATE,
      bannerImage: '/images/events/konference-reality-2026.jpg',
      startDate: new Date('2026-05-10T09:00:00'),
      endDate: new Date('2026-05-11T18:00:00'),
      timezone: 'Europe/Prague',
      location: 'Clarion Congress Hotel Prague',
      address: 'Freyova 945/33, 190 00 Praha 9',
      latitude: 50.1038,
      longitude: 14.4792,
      organizerId: organizer.id,
      maxAttendees: 200,
      attendeeCount: 0,
      price: 5000,
      currency: 'CZK',
      status: EventStatus.PUBLISHED,
      published: true,
      featured: true,
      tags: ['konference', 'reality', 'praha', 'offline', '2-days'],
    },
    {
      slug: 'meetup-financni-poradci-online-duben',
      title: 'Online Meetup: Finanční poradci',
      description: `Neformální online setkání finančních poradců. Prostor pro diskuzi, sdílení zkušeností a řešení problémů z praxe.

Témata k diskuzi:
- Novinky v legislativě
- Osvědčené postupy
- Nástroje pro efektivnější práci
- Výměna zkušeností

Každý může přispět svým tématem nebo dotazem. Volná diskuze a přátelská atmosféra.`,
      type: EventType.MEETUP,
      format: EventFormat.ONLINE,
      category: EventCategory.FINANCIAL,
      bannerImage: '/images/events/meetup-finance-online.jpg',
      startDate: new Date('2026-04-25T19:00:00'),
      endDate: new Date('2026-04-25T21:00:00'),
      timezone: 'Europe/Prague',
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
      organizerId: organizer.id,
      maxAttendees: undefined, // unlimited
      attendeeCount: 0,
      price: 0,
      currency: 'CZK',
      status: EventStatus.PUBLISHED,
      published: true,
      featured: false,
      tags: ['meetup', 'finance', 'online', 'free'],
    },
  ];

  // Create events
  for (const eventData of events) {
    const event = eventRepository.create(eventData);
    const savedEvent = await eventRepository.save(event);
    console.log(`  ✓ Created event: ${savedEvent.title}`);
  }

  console.log('✅ Community events seeded successfully!');
}

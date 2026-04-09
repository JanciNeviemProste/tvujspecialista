import { mockSpecialists } from '@/mocks/specialists';
import type { SpecialistDetail } from '@/lib/hooks/useSpecialist';
import type { Review } from '@/types/review';

/**
 * Pre-baked SpecialistDetail for the /design/specialista/* showcase routes.
 * Uses the first mock specialist + hand-crafted reviews so all 6 variants
 * render with identical data — colleague can compare apples to apples.
 */

const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    specialistId: '1',
    leadId: 'lead-1',
    customerName: 'Martina Kováčová',
    rating: 5,
    text: 'Konečne som našla poradcu, ktorý rozumie mojim potrebám. Pán Novák mi vybavil hypotéku za týždeň a našiel podmienky, ktoré mi ušetrili 280 000 Kč za 25 rokov. Odporúčam!',
    verified: true,
    verifiedEmail: true,
    verifiedSms: true,
    published: true,
    publishedAt: new Date('2026-03-15'),
    createdAt: new Date('2026-03-15'),
    response: {
      text: 'Ďakujem za milé slová, Martina! Bolo mi potešením pracovať s vami. Prajem veľa šťastia v novom bývaní.',
      createdAt: new Date('2026-03-16'),
    },
  },
  {
    id: 'rev-2',
    specialistId: '1',
    leadId: 'lead-2',
    customerName: 'Peter Svoboda',
    rating: 5,
    text: 'Profesionálny prístup, transparentné ceny, žiadne skryté poplatky. Jediný poradca, ktorý mi vysvetlil všetky dôsledky 10 rokov dopredu. Vrátim sa k nemu pri ďalšej investícii.',
    verified: true,
    verifiedEmail: true,
    published: true,
    publishedAt: new Date('2026-02-28'),
    createdAt: new Date('2026-02-28'),
  },
  {
    id: 'rev-3',
    specialistId: '1',
    leadId: 'lead-3',
    customerName: 'Jana Malá',
    rating: 5,
    text: 'Veľmi dobrá komunikácia, odpovedal do hodiny, všetky informácie mi poslal písomne. Porovnali sme 6 bánk a vybrali najlepšiu. Celý proces bol bezstresový.',
    verified: true,
    verifiedEmail: true,
    published: true,
    publishedAt: new Date('2026-02-12'),
    createdAt: new Date('2026-02-12'),
  },
  {
    id: 'rev-4',
    specialistId: '1',
    leadId: 'lead-4',
    customerName: 'Tomáš Horák',
    rating: 4,
    text: 'Dobrá skúsenosť. Poradca bol odborný a pripravený. Jediný drobný mínus bola chvíľa čakania na termín stretnutia, ale výsledok stál za to.',
    verified: true,
    verifiedEmail: true,
    published: true,
    publishedAt: new Date('2026-01-20'),
    createdAt: new Date('2026-01-20'),
  },
];

export function getMockSpecialistDetail(): SpecialistDetail {
  const base = mockSpecialists[0];
  return {
    ...base,
    reviews: MOCK_REVIEWS,
  } as SpecialistDetail;
}

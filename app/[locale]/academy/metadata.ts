import type { Metadata } from 'next';

export const academyMetadata: Metadata = {
  title: 'Akadémia | TvujSpecialista.cz',
  description: 'Prémiové online kurzy pre realitných agentov a finančných poradcov. Video lekcie, certifikáty a študijné materiály od odborníkov.',
  keywords: ['online kurzy', 'realitní makléři', 'finanční poradci', 'certifikáty', 'vzdelávanie', 'Academy'],
  openGraph: {
    title: 'Akadémia | TvujSpecialista.cz',
    description: 'Prémiové online kurzy pre realitných agentov a finančných poradcov.',
    images: ['/og-academy.jpg'],
  },
};

export const coursesMetadata: Metadata = {
  title: 'Katalóg kurzov | Akadémia | TvujSpecialista.cz',
  description: 'Preskúmajte náš kompletný katalóg online kurzov pre realitných agentov a finančných poradcov. Filtrujte podľa kategórie a úrovne.',
  openGraph: {
    title: 'Katalóg kurzov | Akadémia',
    description: 'Preskúmajte náš kompletný katalóg online kurzov.',
    images: ['/og-academy.jpg'],
  },
};

export const myLearningMetadata: Metadata = {
  title: 'Moje vzdelávanie | Akadémia | TvujSpecialista.cz',
  description: 'Pokračujte vo svojom vzdelávaní. Sledujte progres a prístup k zakúpeným kurzom.',
  openGraph: {
    title: 'Moje vzdelávanie | Akadémia',
    description: 'Pokračujte vo svojom vzdelávaní.',
    images: ['/og-academy.jpg'],
  },
};

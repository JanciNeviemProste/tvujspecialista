export interface Region {
  id: string;
  name: string;
  country: 'CZ' | 'SK';
  slug: string;
}

export const regions: Region[] = [
  // Czech Republic - 14 regions
  { id: 'cz-pha', name: 'Hlavní město Praha', country: 'CZ', slug: 'praha' },
  { id: 'cz-stc', name: 'Středočeský kraj', country: 'CZ', slug: 'stredocesky' },
  { id: 'cz-jhc', name: 'Jihočeský kraj', country: 'CZ', slug: 'jihocesky' },
  { id: 'cz-plk', name: 'Plzeňský kraj', country: 'CZ', slug: 'plzensky' },
  { id: 'cz-kvk', name: 'Karlovarský kraj', country: 'CZ', slug: 'karlovarsky' },
  { id: 'cz-ulk', name: 'Ústecký kraj', country: 'CZ', slug: 'ustecky' },
  { id: 'cz-lbk', name: 'Liberecký kraj', country: 'CZ', slug: 'liberecky' },
  { id: 'cz-hkk', name: 'Královéhradecký kraj', country: 'CZ', slug: 'kralovehradecky' },
  { id: 'cz-pak', name: 'Pardubický kraj', country: 'CZ', slug: 'pardubicky' },
  { id: 'cz-vys', name: 'Kraj Vysočina', country: 'CZ', slug: 'vysocina' },
  { id: 'cz-jhm', name: 'Jihomoravský kraj', country: 'CZ', slug: 'jihomoravsky' },
  { id: 'cz-olk', name: 'Olomoucký kraj', country: 'CZ', slug: 'olomoucky' },
  { id: 'cz-msk', name: 'Moravskoslezský kraj', country: 'CZ', slug: 'moravskoslezsky' },
  { id: 'cz-zlk', name: 'Zlínský kraj', country: 'CZ', slug: 'zlinsky' },
  // Slovakia - 8 regions
  { id: 'sk-bl', name: 'Bratislavský kraj', country: 'SK', slug: 'bratislavsky' },
  { id: 'sk-ta', name: 'Trnavský kraj', country: 'SK', slug: 'trnavsky' },
  { id: 'sk-tc', name: 'Trenčiansky kraj', country: 'SK', slug: 'trenciansky' },
  { id: 'sk-ni', name: 'Nitriansky kraj', country: 'SK', slug: 'nitriansky' },
  { id: 'sk-zi', name: 'Žilinský kraj', country: 'SK', slug: 'zilinsky' },
  { id: 'sk-bb', name: 'Banskobystrický kraj', country: 'SK', slug: 'banskobystricky' },
  { id: 'sk-pv', name: 'Prešovský kraj', country: 'SK', slug: 'presovsky' },
  { id: 'sk-ki', name: 'Košický kraj', country: 'SK', slug: 'kosicky' },
];

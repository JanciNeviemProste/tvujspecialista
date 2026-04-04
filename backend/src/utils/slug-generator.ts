export function generateSlug(
  name: string,
  category?: string | null,
  location?: string | null,
): string {
  const normalize = (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const parts = [normalize(name)];

  if (category) {
    parts.push(
      category === 'Finanční poradce' ? 'financni-poradce' : 'realitni-makler',
    );
  }

  if (location) {
    parts.push(normalize(location));
  }

  return parts.join('-');
}

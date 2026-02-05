export function generateSlug(name: string, category: string, location: string): string {
  const normalize = (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const namePart = normalize(name);
  const categoryPart = category === 'Finanční poradce' ? 'financni-poradce' : 'realitni-makler';
  const locationPart = normalize(location);

  return `${namePart}-${categoryPart}-${locationPart}`;
}

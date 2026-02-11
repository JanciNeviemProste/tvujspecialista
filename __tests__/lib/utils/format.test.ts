import {
  formatPrice,
  formatPhone,
  formatRating,
  pluralize,
  formatVideoTime,
  formatDuration,
  formatReviewCount,
  formatDate,
  formatDateTime,
} from '@/lib/utils/format';

describe('formatPrice', () => {
  it('formats price in CZK', () => {
    const result = formatPrice(1999);
    expect(result).toContain('1');
    expect(result).toContain('999');
    expect(result).toContain('Kč');
  });

  it('formats zero price', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
    expect(result).toContain('Kč');
  });

  it('formats large numbers', () => {
    const result = formatPrice(125000);
    expect(result).toContain('125');
    expect(result).toContain('000');
    expect(result).toContain('Kč');
  });

  it('has no decimal places', () => {
    const result = formatPrice(1999);
    expect(result).not.toContain(',00');
    expect(result).not.toContain('.00');
  });
});

describe('formatPhone', () => {
  it('formats Czech phone numbers with +420 prefix', () => {
    expect(formatPhone('420123456789')).toBe('+420 123 456 789');
  });

  it('formats phone with + prefix', () => {
    expect(formatPhone('+420123456789')).toBe('+420 123 456 789');
  });

  it('returns non-420 numbers unchanged', () => {
    expect(formatPhone('+421 900 123 456')).toBe('+421 900 123 456');
  });
});

describe('formatRating', () => {
  it('formats integer to one decimal', () => {
    expect(formatRating(5)).toBe('5.0');
  });

  it('formats decimal to one decimal place', () => {
    expect(formatRating(4.56789)).toBe('4.6');
  });

  it('formats zero', () => {
    expect(formatRating(0)).toBe('0.0');
  });

  it('rounds correctly', () => {
    expect(formatRating(3.75)).toBe('3.8');
    expect(formatRating(3.74)).toBe('3.7');
  });
});

describe('pluralize', () => {
  it('returns singular form for count 1', () => {
    expect(pluralize(1, 'recenze', 'recenze', 'recenzí')).toBe('recenze');
  });

  it('returns few form for counts 2-4 in cs locale', () => {
    expect(pluralize(2, 'recenze', 'recenze', 'recenzí')).toBe('recenze');
    expect(pluralize(3, 'recenze', 'recenze', 'recenzí')).toBe('recenze');
    expect(pluralize(4, 'recenze', 'recenze', 'recenzí')).toBe('recenze');
  });

  it('returns many form for counts 5+', () => {
    expect(pluralize(5, 'recenze', 'recenze', 'recenzí')).toBe('recenzí');
    expect(pluralize(100, 'recenze', 'recenze', 'recenzí')).toBe('recenzí');
  });

  it('returns many form for count 0', () => {
    expect(pluralize(0, 'recenze', 'recenze', 'recenzí')).toBe('recenzí');
  });
});

describe('formatReviewCount', () => {
  it('formats singular', () => {
    expect(formatReviewCount(1)).toBe('1 recenze');
  });

  it('formats few (2-4)', () => {
    expect(formatReviewCount(3)).toBe('3 recenze');
  });

  it('formats many (5+)', () => {
    expect(formatReviewCount(5)).toBe('5 recenzí');
    expect(formatReviewCount(42)).toBe('42 recenzí');
  });

  it('formats zero', () => {
    expect(formatReviewCount(0)).toBe('0 recenzí');
  });
});

describe('formatVideoTime', () => {
  it('formats seconds to MM:SS', () => {
    expect(formatVideoTime(65)).toBe('1:05');
  });

  it('formats to HH:MM:SS for 1+ hours', () => {
    expect(formatVideoTime(3661)).toBe('1:01:01');
  });

  it('zero-pads seconds', () => {
    expect(formatVideoTime(60)).toBe('1:00');
  });

  it('handles zero', () => {
    expect(formatVideoTime(0)).toBe('0:00');
  });

  it('zero-pads minutes and seconds in HH:MM:SS', () => {
    expect(formatVideoTime(3600)).toBe('1:00:00');
  });
});

describe('formatDuration', () => {
  it('formats minutes under 60', () => {
    expect(formatDuration(45)).toBe('45min');
  });

  it('formats exact hours', () => {
    expect(formatDuration(120)).toBe('2h');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30min');
  });

  it('formats single minute', () => {
    expect(formatDuration(1)).toBe('1min');
  });
});

describe('formatDate', () => {
  it('formats date in cs locale', () => {
    const result = formatDate('2024-01-15');
    expect(result).toMatch(/15/);
    expect(result).toMatch(/01/);
    expect(result).toMatch(/2024/);
  });
});

describe('formatDateTime', () => {
  it('formats date and time in cs locale', () => {
    const result = formatDateTime('2024-01-15T14:30:00');
    expect(result).toMatch(/15/);
    expect(result).toMatch(/14/);
    expect(result).toMatch(/30/);
  });
});

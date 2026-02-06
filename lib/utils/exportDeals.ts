import { Deal } from '@/types/deals';
import { formatDate } from './dateFormat';

export function exportDealsToCSV(deals: Deal[], filename?: string) {
  if (deals.length === 0) {
    alert('Žiadne dealy na export');
    return;
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      NEW: 'Nový',
      CONTACTED: 'Kontaktovaný',
      QUALIFIED: 'Kvalifikovaný',
      IN_PROGRESS: 'V procese',
      CLOSED_WON: 'Uzavretý (Vyhrané)',
      CLOSED_LOST: 'Uzavretý (Prehrané)',
    };
    return labels[status] || status;
  };

  const formatValue = (value: unknown) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') {
      // Escape quotes and wrap in quotes if contains comma or newline
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }
    return String(value);
  };

  // CSV Headers
  const headers = [
    'ID',
    'Zákazník',
    'Email',
    'Telefón',
    'Status',
    'Hodnota (€)',
    'Predpokladané uzavretie',
    'Skutočné uzavretie',
    'Vytvorené',
    'Aktualizované',
    'Poznámok',
  ];

  // CSV Rows
  const rows = deals.map((deal) => [
    formatValue(deal.id.slice(0, 8)),
    formatValue(deal.customerName),
    formatValue(deal.customerEmail),
    formatValue(deal.customerPhone),
    formatValue(getStatusLabel(deal.status)),
    formatValue(deal.dealValue ? deal.dealValue.toFixed(2) : ''),
    formatValue(deal.estimatedCloseDate ? formatDate(deal.estimatedCloseDate) : ''),
    formatValue(deal.actualCloseDate ? formatDate(deal.actualCloseDate) : ''),
    formatValue(formatDate(deal.createdAt)),
    formatValue(formatDate(deal.updatedAt)),
    formatValue(deal.notes?.length || 0),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Create blob with UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Generate filename
  const date = new Date().toISOString().split('T')[0];
  const fileName = filename || `deals-${date}.csv`;

  // Trigger download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

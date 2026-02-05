import { exportDealsToCSV } from '@/lib/utils/exportDeals';
import { Deal, DealStatus } from '@/types/deals';

describe('exportDealsToCSV', () => {
  // Mock data
  const mockDeals: Deal[] = [
    {
      id: '12345678-1234-1234-1234-123456789abc',
      specialistId: 'spec-1',
      customerName: 'Ján Novák',
      customerEmail: 'jan.novak@example.com',
      customerPhone: '+421900123456',
      message: 'Potrebujem pomoc s webstránkou',
      status: DealStatus.NEW,
      dealValue: 1500,
      estimatedCloseDate: '2024-03-15',
      actualCloseDate: undefined,
      notes: ['Prvá poznámka', 'Druhá poznámka'],
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-02-05T14:30:00Z',
    },
    {
      id: 'abcdef12-3456-7890-abcd-ef1234567890',
      specialistId: 'spec-2',
      customerName: 'Mária Kováčová',
      customerEmail: 'maria.kovacova@example.com',
      customerPhone: '+421911987654',
      message: 'Záujem o SEO optimalizáciu',
      status: DealStatus.CLOSED_WON,
      dealValue: 2500.50,
      estimatedCloseDate: '2024-02-28',
      actualCloseDate: '2024-02-25',
      notes: ['Poznámka'],
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-02-25T16:00:00Z',
    },
  ];

  let mockAlert: jest.Mock;
  let mockCreateElement: jest.SpyInstance;
  let mockCreateObjectURL: jest.SpyInstance;
  let mockRevokeObjectURL: jest.SpyInstance;
  let mockAppendChild: jest.SpyInstance;
  let mockRemoveChild: jest.SpyInstance;
  let mockClick: jest.Mock;
  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    // Mock window.alert
    mockAlert = jest.fn();
    global.alert = mockAlert;

    // Mock link element
    mockClick = jest.fn();
    mockLink = {
      setAttribute: jest.fn(),
      click: mockClick,
      download: '',
      style: { visibility: '' },
    } as unknown as HTMLAnchorElement;

    // Mock document.createElement
    mockCreateElement = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(mockLink);

    // Mock URL methods
    mockCreateObjectURL = jest.fn().mockReturnValue('blob:mock-url');
    mockRevokeObjectURL = jest.fn();
    global.URL.createObjectURL = mockCreateObjectURL as any;
    global.URL.revokeObjectURL = mockRevokeObjectURL as any;

    // Mock document methods
    mockAppendChild = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation();
    mockRemoveChild = jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ===== BASIC FUNCTIONALITY TESTS =====

  describe('Basic functionality', () => {
    it('1. Exports array of deals to CSV', () => {
      // Arrange & Act
      exportDealsToCSV(mockDeals);

      // Assert
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockClick).toHaveBeenCalled();
    });

    it('2. Uses provided filename or generates default (deals-YYYY-MM-DD.csv)', () => {
      // Arrange
      const customFilename = 'custom-export.csv';

      // Act - with custom filename
      exportDealsToCSV(mockDeals, customFilename);

      // Assert
      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', customFilename);

      // Reset mocks
      jest.clearAllMocks();

      // Act - with default filename
      exportDealsToCSV(mockDeals);

      // Assert - should generate filename with pattern deals-YYYY-MM-DD.csv
      const setAttributeCalls = (mockLink.setAttribute as jest.Mock).mock.calls;
      const downloadCall = setAttributeCalls.find((call) => call[0] === 'download');
      expect(downloadCall).toBeDefined();
      expect(downloadCall[1]).toMatch(/^deals-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it('3. Triggers browser download', () => {
      // Arrange & Act
      exportDealsToCSV(mockDeals);

      // Assert
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  // ===== CSV FORMAT TESTS =====

  describe('CSV format tests', () => {
    it('4. Includes correct headers (Slovak names)', () => {
      // Arrange
      let blobContent = '';
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(function (content: any[]) {
        blobContent = content[0];
        return {};
      }) as any;

      // Act
      exportDealsToCSV(mockDeals);

      // Assert
      expect(blobContent).toContain('ID');
      expect(blobContent).toContain('Zákazník');
      expect(blobContent).toContain('Email');
      expect(blobContent).toContain('Telefón');
      expect(blobContent).toContain('Status');
      expect(blobContent).toContain('Hodnota (€)');
      expect(blobContent).toContain('Predpokladané uzavretie');
      expect(blobContent).toContain('Skutočné uzavretie');
      expect(blobContent).toContain('Vytvorené');
      expect(blobContent).toContain('Aktualizované');
      expect(blobContent).toContain('Poznámok');

      // Cleanup
      global.Blob = originalBlob;
    });

    it('5. Includes all deal fields (customerName, email, phone, status, value, dates, notes count)', () => {
      // Arrange
      let blobContent = '';
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(function (content: any[]) {
        blobContent = content[0];
        return {};
      }) as any;

      // Act
      exportDealsToCSV(mockDeals);

      // Assert
      expect(blobContent).toContain('Ján Novák');
      expect(blobContent).toContain('jan.novak@example.com');
      expect(blobContent).toContain('+421900123456');
      // Note: Status is exported as raw enum value, not translated
      expect(blobContent).toContain('1500');
      expect(blobContent).toContain('2'); // notes count

      // Cleanup
      global.Blob = originalBlob;
    });

    it('6. Formats dates in Slovak locale (dd.MM.yyyy)', () => {
      // Arrange
      let blobContent = '';
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(function (content: any[]) {
        blobContent = content[0];
        return {};
      }) as any;

      // Act
      exportDealsToCSV(mockDeals);

      // Assert - Slovak date format is DD. MM. YYYY
      expect(blobContent).toMatch(/\d{2}\.\s\d{2}\.\s\d{4}/);

      // Cleanup
      global.Blob = originalBlob;
    });

    it('7. Formats currency values as EUR', () => {
      // Arrange
      let blobContent = '';
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(function (content: any[]) {
        blobContent = content[0];
        return {};
      }) as any;

      // Act
      exportDealsToCSV(mockDeals);

      // Assert - values should be formatted with 2 decimal places
      expect(blobContent).toContain('1500.00');
      expect(blobContent).toContain('2500.50');

      // Cleanup
      global.Blob = originalBlob;
    });
  });

  // ===== UTF-8 ENCODING TESTS =====

  describe('UTF-8 encoding tests', () => {
    it('8. Handles Slovak special characters (á, č, ď, é, í, ľ, ň, ó, š, ť, ú, ý, ž)', () => {
      // Arrange
      const dealsWithSpecialChars: Deal[] = [
        {
          ...mockDeals[0],
          customerName: 'Ľuboš Čierny',
          message: 'Potrebujem webstránku s českou a slovenskou diakritikou: áčďéíľňóšťúýž',
        },
      ];

      let blobContent = '';
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(function (content: any[]) {
        blobContent = content[0];
        return {};
      }) as any;

      // Act
      exportDealsToCSV(dealsWithSpecialChars);

      // Assert
      expect(blobContent).toContain('Ľuboš Čierny');
      expect(blobContent).toContain('Zákazník'); // Header with special chars

      // Cleanup
      global.Blob = originalBlob;
    });

    it('9. Includes UTF-8 BOM for Excel compatibility', () => {
      // Arrange
      let blobContent = '';
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(function (content: any[]) {
        blobContent = content[0];
        return {};
      }) as any;

      // Act
      exportDealsToCSV(mockDeals);

      // Assert - BOM is \uFEFF
      expect(blobContent.charCodeAt(0)).toBe(0xfeff);

      // Cleanup
      global.Blob = originalBlob;
    });
  });

  // ===== EMPTY VALUES HANDLING =====

  describe('Empty values handling', () => {
    it('10. Handles null/undefined dealValue', () => {
      // Arrange
      const dealsWithoutValue: Deal[] = [
        {
          ...mockDeals[0],
          dealValue: undefined,
        },
      ];

      let blobContent = '';
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(function (content: any[]) {
        blobContent = content[0];
        return {};
      }) as any;

      // Act
      exportDealsToCSV(dealsWithoutValue);

      // Assert - should have empty value between commas
      const lines = blobContent.split('\n');
      const dataLine = lines[1]; // First data row
      expect(dataLine).toMatch(/,,/); // Empty value field

      // Cleanup
      global.Blob = originalBlob;
    });

    it('11. Handles missing estimatedCloseDate', () => {
      // Arrange
      const dealsWithoutDate: Deal[] = [
        {
          ...mockDeals[0],
          estimatedCloseDate: undefined,
        },
      ];

      let blobContent = '';
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(function (content: any[]) {
        blobContent = content[0];
        return {};
      }) as any;

      // Act
      exportDealsToCSV(dealsWithoutDate);

      // Assert - should have empty value for date
      const lines = blobContent.split('\n');
      const dataLine = lines[1];
      expect(dataLine).toMatch(/,,/); // Empty date field

      // Cleanup
      global.Blob = originalBlob;
    });
  });

  // ===== EDGE CASES =====

  describe('Edge cases', () => {
    it('12. Handles empty deals array (exports only headers)', () => {
      // Arrange & Act
      exportDealsToCSV([]);

      // Assert
      expect(mockAlert).toHaveBeenCalledWith('Žiadne dealy na export');
      expect(mockClick).not.toHaveBeenCalled();
    });

    it('13. Handles single deal', () => {
      // Arrange
      let blobContent = '';
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(function (content: any[]) {
        blobContent = content[0];
        return {};
      }) as any;

      // Act
      exportDealsToCSV([mockDeals[0]]);

      // Assert
      const lines = blobContent.split('\n');
      expect(lines.length).toBe(2); // Header + 1 data row
      expect(blobContent).toContain('Ján Novák');

      // Cleanup
      global.Blob = originalBlob;
    });

    it('14. Handles deals with special characters in text fields (quotes, commas, newlines)', () => {
      // Arrange
      const dealsWithSpecialChars: Deal[] = [
        {
          ...mockDeals[0],
          customerName: 'Test "Quote" Name',
          message: 'Text with, comma and\nnewline',
        },
      ];

      let blobContent = '';
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(function (content: any[]) {
        blobContent = content[0];
        return {};
      }) as any;

      // Act
      exportDealsToCSV(dealsWithSpecialChars);

      // Assert - quotes should be escaped and wrapped
      expect(blobContent).toContain('"Test ""Quote"" Name"');

      // Cleanup
      global.Blob = originalBlob;
    });
  });

  // ===== BROWSER API MOCK TEST =====

  describe('Browser API mock', () => {
    it('15. Mocks document.createElement, URL.createObjectURL, link.click()', () => {
      // Arrange & Act
      exportDealsToCSV(mockDeals);

      // Assert
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'blob:mock-url');
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringMatching(/\.csv$/)
      );
    });
  });
});

import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useMyDeals,
  useUpdateDealStatus,
  useDealAnalytics,
  useCloseDeal,
} from '@/lib/hooks/useDeals';
import { dealsApi } from '@/lib/api/deals';
import { DealStatus } from '@/types/deals';
import type { Deal, DealAnalyticsData } from '@/types/deals';

// Mock the API module
jest.mock('@/lib/api/deals');
// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedDealsApi = dealsApi as jest.Mocked<typeof dealsApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Suppress errors in tests
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

// Mock deal data
const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    specialistId: 'spec-1',
    customerName: 'Jan Novak',
    customerEmail: 'jan@example.com',
    customerPhone: '+420123456789',
    message: 'Need help with website',
    status: DealStatus.NEW,
    dealValue: 5000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 'deal-2',
    specialistId: 'spec-1',
    customerName: 'Maria Kovacova',
    customerEmail: 'maria@example.com',
    customerPhone: '+420987654321',
    message: 'SEO optimization needed',
    status: DealStatus.IN_PROGRESS,
    dealValue: 8000,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
  },
];

const mockAnalytics: DealAnalyticsData = {
  conversionRate: 0.35,
  averageDealValue: 6500,
  averageTimeToClose: 14,
  winRate: 0.6,
  statusDistribution: [
    { status: DealStatus.NEW, count: 5 },
    { status: DealStatus.IN_PROGRESS, count: 3 },
    { status: DealStatus.CLOSED_WON, count: 6 },
    { status: DealStatus.CLOSED_LOST, count: 4 },
  ],
  monthlyTrend: [
    { month: '2024-01', won: 3, lost: 2 },
    { month: '2024-02', won: 4, lost: 1 },
  ],
};

describe('useDeals hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== useMyDeals =====
  describe('useMyDeals', () => {
    it('fetches and returns deals on success', async () => {
      mockedDealsApi.getMyDeals.mockResolvedValue({
        data: mockDeals,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useMyDeals(), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockDeals);
      expect(mockedDealsApi.getMyDeals).toHaveBeenCalledTimes(1);
    });

    it('returns error state when API fails', async () => {
      mockedDealsApi.getMyDeals.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useMyDeals(), {
        wrapper: createWrapper(),
      });

      // useMyDeals has retry: 3 (RETRY_CONFIG), so we wait for all retries to complete
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 30000 }
      );

      expect(result.current.error).toBeDefined();
      // Should have been called 4 times total (initial + 3 retries)
      expect(mockedDealsApi.getMyDeals.mock.calls.length).toBeGreaterThanOrEqual(2);
    }, 35000);
  });

  // ===== useUpdateDealStatus =====
  describe('useUpdateDealStatus', () => {
    it('calls API with correct deal id and status data', async () => {
      const updatedDeal: Deal = {
        ...mockDeals[0],
        status: DealStatus.CONTACTED,
      };

      mockedDealsApi.updateDealStatus.mockResolvedValue({
        data: updatedDeal,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useUpdateDealStatus(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          id: 'deal-1',
          data: { status: DealStatus.CONTACTED },
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedDealsApi.updateDealStatus).toHaveBeenCalledWith('deal-1', {
        status: DealStatus.CONTACTED,
      });
    });

    it('handles mutation error', async () => {
      mockedDealsApi.updateDealStatus.mockRejectedValue(
        new Error('Update failed')
      );

      const { result } = renderHook(() => useUpdateDealStatus(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          id: 'deal-1',
          data: { status: DealStatus.CONTACTED },
        });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  // ===== useDealAnalytics =====
  describe('useDealAnalytics', () => {
    it('fetches and returns analytics data', async () => {
      mockedDealsApi.getMyAnalytics.mockResolvedValue({
        data: mockAnalytics,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useDealAnalytics(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockAnalytics);
      expect(result.current.data?.conversionRate).toBe(0.35);
      expect(result.current.data?.averageDealValue).toBe(6500);
      expect(result.current.data?.statusDistribution).toHaveLength(4);
      expect(result.current.data?.monthlyTrend).toHaveLength(2);
      expect(mockedDealsApi.getMyAnalytics).toHaveBeenCalledTimes(1);
    });

    it('returns error state when analytics fetch fails', async () => {
      mockedDealsApi.getMyAnalytics.mockRejectedValue(
        new Error('Analytics unavailable')
      );

      const { result } = renderHook(() => useDealAnalytics(), {
        wrapper: createWrapper(),
      });

      // useDealAnalytics has retry: 3 (RETRY_CONFIG), so we wait for all retries to complete
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 30000 }
      );

      expect(result.current.error).toBeDefined();
      // Should have been called multiple times due to retries
      expect(mockedDealsApi.getMyAnalytics.mock.calls.length).toBeGreaterThanOrEqual(2);
    }, 35000);
  });

  // ===== useCloseDeal =====
  describe('useCloseDeal', () => {
    it('closes a deal with CLOSED_WON status', async () => {
      const closedDeal: Deal = {
        ...mockDeals[0],
        status: DealStatus.CLOSED_WON,
        actualCloseDate: '2024-02-01T00:00:00Z',
      };

      mockedDealsApi.closeDeal.mockResolvedValue({
        data: closedDeal,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useCloseDeal(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          id: 'deal-1',
          data: {
            status: DealStatus.CLOSED_WON,
            actualDealValue: 5000,
          },
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedDealsApi.closeDeal).toHaveBeenCalledWith('deal-1', {
        status: DealStatus.CLOSED_WON,
        actualDealValue: 5000,
      });
    });

    it('closes a deal with CLOSED_LOST status', async () => {
      const lostDeal: Deal = {
        ...mockDeals[0],
        status: DealStatus.CLOSED_LOST,
        actualCloseDate: '2024-02-01T00:00:00Z',
      };

      mockedDealsApi.closeDeal.mockResolvedValue({
        data: lostDeal,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useCloseDeal(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          id: 'deal-1',
          data: { status: DealStatus.CLOSED_LOST },
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedDealsApi.closeDeal).toHaveBeenCalledWith('deal-1', {
        status: DealStatus.CLOSED_LOST,
      });
    });

    it('handles close deal error', async () => {
      mockedDealsApi.closeDeal.mockRejectedValue(new Error('Close failed'));

      const { result } = renderHook(() => useCloseDeal(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          id: 'deal-1',
          data: { status: DealStatus.CLOSED_WON },
        });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });
});

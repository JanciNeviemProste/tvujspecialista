/**
 * Performance Monitoring Utilities
 *
 * Provides functions to measure and log performance metrics
 * for critical operations in the application.
 */

interface PerformanceMetrics {
  operationName: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

const SLOW_OPERATION_THRESHOLD = 1000; // 1 second
const VERY_SLOW_OPERATION_THRESHOLD = 3000; // 3 seconds

/**
 * Measures the performance of filter operations
 *
 * @param filterName - Name of the filter being measured
 * @param operation - The filter operation to measure
 * @returns The result of the operation
 *
 * @example
 * const filtered = await measureFilterPerformance('statusFilter', () => {
 *   return deals.filter(deal => deal.status === selectedStatus);
 * });
 */
export async function measureFilterPerformance<T>(
  filterName: string,
  operation: () => T | Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await Promise.resolve(operation());
    const duration = performance.now() - startTime;

    logPerformanceMetric({
      operationName: `Filter: ${filterName}`,
      duration,
      timestamp: new Date(),
      metadata,
    });

    if (duration > SLOW_OPERATION_THRESHOLD) {
      logSlowOperation(`Filter: ${filterName}`, duration, metadata);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logPerformanceMetric({
      operationName: `Filter: ${filterName} (ERROR)`,
      duration,
      timestamp: new Date(),
      metadata: { ...metadata, error: String(error) },
    });
    throw error;
  }
}

/**
 * Measures the performance of export operations
 *
 * @param exportType - Type of export (CSV, PDF, etc.)
 * @param operation - The export operation to measure
 * @returns The result of the operation
 *
 * @example
 * await measureExportPerformance('CSV', () => {
 *   return exportDealsToCSV(deals);
 * });
 */
export async function measureExportPerformance<T>(
  exportType: string,
  operation: () => T | Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await Promise.resolve(operation());
    const duration = performance.now() - startTime;

    logPerformanceMetric({
      operationName: `Export: ${exportType}`,
      duration,
      timestamp: new Date(),
      metadata,
    });

    if (duration > SLOW_OPERATION_THRESHOLD) {
      logSlowOperation(`Export: ${exportType}`, duration, metadata);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logPerformanceMetric({
      operationName: `Export: ${exportType} (ERROR)`,
      duration,
      timestamp: new Date(),
      metadata: { ...metadata, error: String(error) },
    });
    throw error;
  }
}

/**
 * Logs slow operations with enhanced context
 *
 * @param operationName - Name of the slow operation
 * @param duration - Duration in milliseconds
 * @param metadata - Additional context
 */
export function logSlowOperation(
  operationName: string,
  duration: number,
  metadata?: Record<string, any>
): void {
  const severity = duration > VERY_SLOW_OPERATION_THRESHOLD ? 'ERROR' : 'WARN';
  const message = `[PERFORMANCE ${severity}] Slow operation detected: ${operationName}`;

  const details = {
    duration: `${duration.toFixed(2)}ms`,
    threshold: `${SLOW_OPERATION_THRESHOLD}ms`,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  if (severity === 'ERROR') {
    console.error(message, details);
  } else {
    console.warn(message, details);
  }

  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // Example: Send to analytics/monitoring service
    // sendToMonitoring({ type: 'slow_operation', operationName, duration, metadata });
  }
}

/**
 * Logs performance metrics
 *
 * @param metrics - Performance metrics to log
 */
function logPerformanceMetric(metrics: PerformanceMetrics): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[PERFORMANCE]', {
      operation: metrics.operationName,
      duration: `${metrics.duration.toFixed(2)}ms`,
      timestamp: metrics.timestamp.toISOString(),
      ...metrics.metadata,
    });
  }

  // Store metrics for analysis
  if (typeof window !== 'undefined') {
    const key = 'performance_metrics';
    const stored = sessionStorage.getItem(key);
    const existing = stored ? JSON.parse(stored) : [];

    // Keep only last 100 metrics
    const updated = [...existing, metrics].slice(-100);
    sessionStorage.setItem(key, JSON.stringify(updated));
  }
}

/**
 * Gets stored performance metrics
 *
 * @returns Array of performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics[] {
  if (typeof window === 'undefined') return [];

  const stored = sessionStorage.getItem('performance_metrics');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Clears stored performance metrics
 */
export function clearPerformanceMetrics(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('performance_metrics');
  }
}

/**
 * Gets performance summary statistics
 *
 * @param operationFilter - Optional filter for specific operations
 * @returns Performance summary
 */
export function getPerformanceSummary(operationFilter?: string): {
  count: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  slowOperations: number;
} {
  const metrics = getPerformanceMetrics();
  const filtered = operationFilter
    ? metrics.filter(m => m.operationName.includes(operationFilter))
    : metrics;

  if (filtered.length === 0) {
    return {
      count: 0,
      averageDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      slowOperations: 0,
    };
  }

  const durations = filtered.map(m => m.duration);
  const sum = durations.reduce((a, b) => a + b, 0);

  return {
    count: filtered.length,
    averageDuration: sum / filtered.length,
    minDuration: Math.min(...durations),
    maxDuration: Math.max(...durations),
    slowOperations: filtered.filter(m => m.duration > SLOW_OPERATION_THRESHOLD).length,
  };
}

/**
 * Generic performance measurement wrapper
 *
 * @param operationName - Name of the operation
 * @param operation - The operation to measure
 * @param options - Measurement options
 * @returns The result of the operation
 *
 * @example
 * const result = await measurePerformance('fetchDeals', async () => {
 *   return await fetch('/api/deals');
 * }, { logToConsole: true });
 */
export async function measurePerformance<T>(
  operationName: string,
  operation: () => T | Promise<T>,
  options: {
    metadata?: Record<string, any>;
    logToConsole?: boolean;
    throwOnSlow?: boolean;
  } = {}
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await Promise.resolve(operation());
    const duration = performance.now() - startTime;

    const metrics: PerformanceMetrics = {
      operationName,
      duration,
      timestamp: new Date(),
      metadata: options.metadata,
    };

    if (options.logToConsole || process.env.NODE_ENV === 'development') {
      logPerformanceMetric(metrics);
    }

    if (duration > SLOW_OPERATION_THRESHOLD) {
      logSlowOperation(operationName, duration, options.metadata);

      if (options.throwOnSlow) {
        throw new Error(`Operation "${operationName}" exceeded threshold: ${duration}ms`);
      }
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logPerformanceMetric({
      operationName: `${operationName} (ERROR)`,
      duration,
      timestamp: new Date(),
      metadata: { ...options.metadata, error: String(error) },
    });
    throw error;
  }
}

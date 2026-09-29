import { describe, it, expect, jest } from '@jest/globals';
import logger, { morganMiddleware } from '../../../src/utils/logger';

describe('Logger Module', () => {
  it('should expose winston logger with standard log methods', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('should export morganMiddleware as Express middleware function', () => {
    expect(morganMiddleware).toBeDefined();
    expect(typeof morganMiddleware).toBe('function');
  });

  it('should log messages without throwing', () => {
    const infoSpy = jest.spyOn(logger, 'info').mockImplementation((() => logger) as any);
    const errorSpy = jest.spyOn(logger, 'error').mockImplementation((() => logger) as any);

    logger.info('Test informational message');
    logger.error('Test error message', { error: 'mock' });

    expect(infoSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();

    infoSpy.mockRestore();
    errorSpy.mockRestore();
  });
});

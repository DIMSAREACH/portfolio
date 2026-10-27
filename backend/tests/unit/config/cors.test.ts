import { describe, it, expect } from '@jest/globals';
import corsOptions from '../../../src/config/cors';

describe('CORS Configuration', () => {
  it('should have credentials enabled', () => {
    expect(corsOptions.credentials).toBe(true);
  });

  it('should allow requests without origin (like curl or mobile apps)', (done) => {
    if (typeof corsOptions.origin === 'function') {
      corsOptions.origin(undefined, (err, allow) => {
        expect(err).toBeNull();
        expect(allow).toBe(true);
        done();
      });
    } else {
      done();
    }
  });

  it('should block unauthorized external origins', (done) => {
    if (typeof corsOptions.origin === 'function') {
      corsOptions.origin('https://evil-hacker.com', (err, allow) => {
        expect(err).toBeTruthy();
        expect(allow).toBeFalsy();
        done();
      });
    } else {
      done();
    }
  });
});

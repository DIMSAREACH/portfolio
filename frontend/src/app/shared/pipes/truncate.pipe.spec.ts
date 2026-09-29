import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return unchanged text if length is within limit', () => {
    const text = 'Hello world';
    expect(pipe.transform(text, 20)).toBe('Hello world');
  });

  it('should truncate text and append ellipsis when exceeding limit', () => {
    const text = 'This is a long sentence that needs truncating';
    expect(pipe.transform(text, 10)).toBe('This is a ...');
  });

  it('should respect completeWords flag and break at last space', () => {
    const text = 'This is a long sentence';
    // index 12 is 'This is a lo' -> last space before index 12 is at index 9 ('This is a')
    expect(pipe.transform(text, 12, true)).toBe('This is a...');
  });

  it('should support custom ellipsis', () => {
    const text = 'Custom ellipsis test message';
    expect(pipe.transform(text, 10, false, ' [more]')).toBe('Custom ell [more]');
  });

  it('should return empty string for null or undefined input', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});

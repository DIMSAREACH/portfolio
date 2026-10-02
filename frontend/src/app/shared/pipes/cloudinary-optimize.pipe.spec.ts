import { CloudinaryOptimizePipe } from './cloudinary-optimize.pipe';

describe('CloudinaryOptimizePipe', () => {
  let pipe: CloudinaryOptimizePipe;

  beforeEach(() => {
    pipe = new CloudinaryOptimizePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null, undefined, or empty values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('should return non-Cloudinary URLs unmodified', () => {
    const url = 'https://images.unsplash.com/photo-12345?w=500';
    expect(pipe.transform(url)).toBe(url);

    const localAsset = '/assets/images/profile.jpg';
    expect(pipe.transform(localAsset)).toBe(localAsset);
  });

  it('should inject f_auto,q_auto transformations into Cloudinary upload URLs', () => {
    const original = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    const expected = 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/sample.jpg';

    expect(pipe.transform(original)).toBe(expected);
  });

  it('should support additional custom transformations', () => {
    const original = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    const expected = 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/sample.jpg';

    expect(pipe.transform(original, 'w_800')).toBe(expected);
  });

  it('should not duplicate f_auto,q_auto if already present', () => {
    const alreadyOptimized = 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/sample.jpg';
    expect(pipe.transform(alreadyOptimized)).toBe(alreadyOptimized);
  });
});

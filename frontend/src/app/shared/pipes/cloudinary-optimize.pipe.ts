import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cloudinaryOptimize',
  standalone: true,
})
export class CloudinaryOptimizePipe implements PipeTransform {
  /**
   * Automatically optimize Cloudinary images with f_auto,q_auto per PRD Section 24.2
   * @param url Image URL
   * @param extraTransforms Optional extra transformations e.g. 'w_800'
   */
  transform(url: string | null | undefined, extraTransforms?: string): string {
    if (!url || typeof url !== 'string') {
      return '';
    }

    // Only apply to Cloudinary delivery URLs
    if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
      return url;
    }

    // Avoid duplicate transformations
    if (url.includes('/upload/f_auto,q_auto') || url.includes('/upload/q_auto,f_auto')) {
      return url;
    }

    let transforms = 'f_auto,q_auto';
    if (extraTransforms) {
      transforms += `,${extraTransforms}`;
    }

    // Insert transformations right after /upload/
    return url.replace('/upload/', `/upload/${transforms}/`);
  }
}

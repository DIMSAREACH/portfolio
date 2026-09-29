import { describe, it, expect } from '@jest/globals';
import Certification from '../../../src/models/Certification';

describe('Certification Model', () => {
  const validCertData = {
    name: {
      en: 'AWS Certified Solutions Architect',
      kh: 'ស្ថាបត្យករដំណោះស្រាយដែលមានវិញ្ញាបនបត្រ AWS',
    },
    type: 'certification' as const,
    organization: {
      en: 'Amazon Web Services',
      kh: 'ក្រុមហ៊ុន Amazon Web Services',
    },
    issueDate: new Date('2024-03-01'),
  };

  it('should validate a certification with required attributes and defaults', async () => {
    const cert = new Certification(validCertData);

    await expect(cert.validate()).resolves.toBeUndefined();
    expect(cert.name.en).toBe('AWS Certified Solutions Architect');
    expect(cert.type).toBe('certification');
    expect(cert.organization.en).toBe('Amazon Web Services');
    expect(cert.issueDate).toEqual(new Date('2024-03-01'));
    expect(cert.isVisible).toBe(true);
    expect(cert.order).toBe(0);
  });

  it('should reject when required fields are missing', async () => {
    const emptyCert = new Certification({});

    await expect(emptyCert.validate()).rejects.toThrow();
  });

  it('should accept all valid types (certification, award, achievement)', async () => {
    const types = ['certification', 'award', 'achievement'] as const;

    for (const type of types) {
      const cert = new Certification({ ...validCertData, type });
      await expect(cert.validate()).resolves.toBeUndefined();
      expect(cert.type).toBe(type);
    }
  });

  it('should reject invalid certification type', async () => {
    const invalidCert = new Certification({
      ...validCertData,
      type: 'invalid-type' as unknown as 'certification',
    });

    await expect(invalidCert.validate()).rejects.toThrow(/not a valid certification type/);
  });

  it('should validate all optional fields correctly', async () => {
    const expirationDate = new Date('2027-03-01');
    const cert = new Certification({
      ...validCertData,
      expirationDate,
      credentialId: 'AWS-PSA-123456',
      credentialUrl: 'https://aws.amazon.com/verification/123456',
      image: 'https://res.cloudinary.com/demo/image/upload/aws-cert.png',
      description: {
        en: 'Earned for architecting resilient distributed cloud systems.',
        kh: 'ទទួលបានសម្រាប់ការរៀបចំស្ថាបត្យកម្មប្រព័ន្ធ Cloud ធន់និងចែកចាយ។',
      },
      isVisible: false,
      order: 2,
    });

    await expect(cert.validate()).resolves.toBeUndefined();
    expect(cert.expirationDate).toEqual(expirationDate);
    expect(cert.credentialId).toBe('AWS-PSA-123456');
    expect(cert.credentialUrl).toBe('https://aws.amazon.com/verification/123456');
    expect(cert.image).toBe('https://res.cloudinary.com/demo/image/upload/aws-cert.png');
    expect(cert.isVisible).toBe(false);
    expect(cert.order).toBe(2);
  });

  it('should define compound index on type and order per PRD Section 11.9', () => {
    const indexes = Certification.schema.indexes();

    const compoundIndex = indexes.find(
      (idx) => 'type' in idx[0] && 'order' in idx[0],
    );
    expect(compoundIndex).toBeDefined();
    expect(compoundIndex?.[0]).toEqual({ type: 1, order: 1 });
  });
});

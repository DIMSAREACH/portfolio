import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ContactComponent } from './contact.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService, SupportedLanguage } from '../../../core/services/language.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ApiResponse, Message, Profile, SocialLink } from '../../../core/models';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  let portfolioServiceMock: {
    submitContact: ReturnType<typeof vi.fn>;
    getProfile: ReturnType<typeof vi.fn>;
    getSocialLinks: ReturnType<typeof vi.fn>;
  };

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  let notificationServiceMock: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };

  const mockProfile: Profile = {
    _id: 'prof1',
    fullName: { en: 'Dim Sareach', kh: 'ឌឹម សារាជ' },
    title: { en: 'Full Stack Developer', kh: 'អ្នកអភិវឌ្ឍន៍ Full Stack' },
    introduction: { en: 'Bio text', kh: 'ប្រវត្តិសង្ខេប' },
    email: 'contact@dimsareach.dev',
    location: { en: 'Phnom Penh, Cambodia', kh: 'រាជធានីភ្នំពេញ កម្ពុជា' },
    profileImage: 'https://example.com/avatar.jpg',
    about: { en: 'About me', kh: 'អំពីខ្ញុំ' },
  };

  const mockSocialLinks: SocialLink[] = [
    {
      _id: 'soc1',
      platform: 'github',
      label: 'GitHub',
      url: 'https://github.com/dimsareach',
      icon: 'github',
      isVisible: true,
      order: 1,
    },
    {
      _id: 'soc2',
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/dimsareach',
      icon: 'linkedin',
      isVisible: true,
      order: 2,
    },
  ];

  const mockMessageResponse: ApiResponse<Message> = {
    success: true,
    message: 'Message sent successfully',
    data: {
      _id: 'msg1',
      name: 'Alice',
      email: 'alice@example.com',
      subject: 'Collaboration opportunity',
      message: 'Hello Dim, I would like to discuss a project with you.',
      isRead: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      submitContact: vi.fn().mockReturnValue(of(mockMessageResponse)),
      getProfile: vi.fn().mockReturnValue(of({ success: true, message: 'Profile', data: mockProfile })),
      getSocialLinks: vi.fn().mockReturnValue(of({ success: true, message: 'Social links', data: mockSocialLinks })),
    };

    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal<boolean>(false),
    };

    notificationServiceMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.valid).toBe(false);
  });

  it('should load profile info and social links on init', () => {
    fixture.detectChanges();

    expect(portfolioServiceMock.getProfile).toHaveBeenCalled();
    expect(portfolioServiceMock.getSocialLinks).toHaveBeenCalled();
    expect(component.email()).toBe('contact@dimsareach.dev');
    expect(component.location()).toBe('Phnom Penh, Cambodia');
    expect(component.socialLinks().length).toBe(2);
  });

  it('should validate required fields', () => {
    fixture.detectChanges();

    const nameCtrl = component.contactForm.get('name');
    const emailCtrl = component.contactForm.get('email');
    const subjectCtrl = component.contactForm.get('subject');
    const messageCtrl = component.contactForm.get('message');

    expect(nameCtrl?.valid).toBe(false);
    expect(nameCtrl?.hasError('required')).toBe(true);

    expect(emailCtrl?.valid).toBe(false);
    expect(emailCtrl?.hasError('required')).toBe(true);

    expect(subjectCtrl?.valid).toBe(false);
    expect(subjectCtrl?.hasError('required')).toBe(true);

    expect(messageCtrl?.valid).toBe(false);
    expect(messageCtrl?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    fixture.detectChanges();

    const emailCtrl = component.contactForm.get('email');
    emailCtrl?.setValue('invalid-email');
    expect(emailCtrl?.hasError('email')).toBe(true);

    emailCtrl?.setValue('valid.user@example.com');
    expect(emailCtrl?.hasError('email')).toBe(false);
  });

  it('should validate length constraints on fields', () => {
    fixture.detectChanges();

    const nameCtrl = component.contactForm.get('name');
    nameCtrl?.setValue('A'); // min 2
    expect(nameCtrl?.hasError('minlength')).toBe(true);

    const subjectCtrl = component.contactForm.get('subject');
    subjectCtrl?.setValue('Hi'); // min 5
    expect(subjectCtrl?.hasError('minlength')).toBe(true);

    const messageCtrl = component.contactForm.get('message');
    messageCtrl?.setValue('Short'); // min 10
    expect(messageCtrl?.hasError('minlength')).toBe(true);
  });

  it('should not submit if form is invalid and mark controls as touched', () => {
    fixture.detectChanges();

    component.onSubmit();
    expect(portfolioServiceMock.submitContact).not.toHaveBeenCalled();
    expect(component.contactForm.touched).toBe(true);
  });

  it('should submit valid form and trigger success alert and notification', () => {
    fixture.detectChanges();

    component.contactForm.setValue({
      name: 'Bob Builder',
      email: 'bob@example.com',
      subject: 'Construction Software',
      message: 'We need a robust dashboard built with Angular and Node.js.',
      honeypot: '',
    });

    expect(component.contactForm.valid).toBe(true);

    component.onSubmit();

    expect(portfolioServiceMock.submitContact).toHaveBeenCalledWith({
      name: 'Bob Builder',
      email: 'bob@example.com',
      subject: 'Construction Software',
      message: 'We need a robust dashboard built with Angular and Node.js.',
    });

    expect(component.isSuccess()).toBe(true);
    expect(notificationServiceMock.success).toHaveBeenCalled();
  });

  it('should silently handle honeypot filled without calling API (spam protection)', () => {
    fixture.detectChanges();

    component.contactForm.setValue({
      name: 'Spam Bot',
      email: 'bot@spam.com',
      subject: 'Buy crypto now',
      message: 'Cheapest prices for coin tokens here.',
      honeypot: 'http://spam-link.com',
    });

    component.onSubmit();

    expect(portfolioServiceMock.submitContact).not.toHaveBeenCalled();
    expect(component.isSuccess()).toBe(true);
  });

  it('should handle API submission errors and display error message', () => {
    fixture.detectChanges();

    portfolioServiceMock.submitContact.mockReturnValue(
      throwError(() => ({ error: { message: 'Too many requests. Please try again later.' } })),
    );

    component.contactForm.setValue({
      name: 'Alice Cooper',
      email: 'alice@example.com',
      subject: 'Website overhaul',
      message: 'Looking for a complete portfolio redesign.',
      honeypot: '',
    });

    component.onSubmit();

    expect(component.isSubmitting()).toBe(false);
    expect(component.submitError()).toContain('Too many requests');
    expect(notificationServiceMock.error).toHaveBeenCalled();
  });

  it('should reset form state when requested', () => {
    fixture.detectChanges();

    component.isSuccess.set(true);
    component.submitError.set('Some error');

    component.resetFormState();

    expect(component.isSuccess()).toBe(false);
    expect(component.submitError()).toBeNull();
  });
});

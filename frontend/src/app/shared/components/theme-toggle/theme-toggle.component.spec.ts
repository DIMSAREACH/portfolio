import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../../core/services/theme.service';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeServiceMock: {
    isDark: ReturnType<typeof signal<boolean>>;
    toggle: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    themeServiceMock = {
      isDark: signal(false),
      toggle: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [{ provide: ThemeService, useValue: themeServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call themeService.toggleTheme when clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(themeServiceMock.toggle).toHaveBeenCalled();
  });

  it('should display moon icon in light mode', () => {
    themeServiceMock.isDark.set(false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
  });

  it('should display sun icon in dark mode', () => {
    themeServiceMock.isDark.set(true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
  });
});

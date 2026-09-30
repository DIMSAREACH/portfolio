import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('AdminSidebarComponent', () => {
  let component: AdminSidebarComponent;
  let fixture: ComponentFixture<AdminSidebarComponent>;

  let authServiceMock: {
    currentUser: ReturnType<typeof signal>;
  };

  beforeEach(async () => {
    authServiceMock = {
      currentUser: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [AdminSidebarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render exactly 15 navigation items per PRD 9.1', () => {
    const totalItems = component.navGroups.reduce((acc, g) => acc + g.items.length, 0);
    expect(totalItems).toBe(15);

    const links = fixture.nativeElement.querySelectorAll('nav a');
    expect(links.length).toBe(15);
  });

  it('should include key sections like Dashboard, Projects, Blog, Messages, and Settings', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Dashboard');
    expect(compiled.textContent).toContain('Projects');
    expect(compiled.textContent).toContain('Skills');
    expect(compiled.textContent).toContain('Experience');
    expect(compiled.textContent).toContain('Education');
    expect(compiled.textContent).toContain('Certifications');
    expect(compiled.textContent).toContain('Achievements');
    expect(compiled.textContent).toContain('Blog Posts');
    expect(compiled.textContent).toContain('Messages');
    expect(compiled.textContent).toContain('Settings');
  });

  it('should emit closeSidebar when onItemClick is called', () => {
    const spy = vi.spyOn(component.closeSidebar, 'emit');
    component.onItemClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should reflect isOpen input class changes', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('translate-x-0')).toBe(true);

    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    expect(aside.classList.contains('-translate-x-full')).toBe(true);
  });

  it('should display unread badge when unreadMessageCount > 0', () => {
    component.unreadMessageCount.set(3);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('#sidebar-unread-badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('3');
  });
});

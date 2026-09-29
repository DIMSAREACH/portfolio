import { routes } from './app.routes';
import { authGuard, guestGuard } from './core/guards';

describe('App Routes', () => {
  it('should define public root route with children', () => {
    const rootRoute = routes.find((r) => r.path === '');
    expect(rootRoute).toBeDefined();
    expect(rootRoute?.children).toBeDefined();
    expect(rootRoute?.children?.length).toBeGreaterThan(0);
  });

  it('should include all required public child paths', () => {
    const rootRoute = routes.find((r) => r.path === '');
    const childPaths = rootRoute?.children?.map((c) => c.path);

    expect(childPaths).toContain('');
    expect(childPaths).toContain('about');
    expect(childPaths).toContain('skills');
    expect(childPaths).toContain('experience');
    expect(childPaths).toContain('education');
    expect(childPaths).toContain('projects');
    expect(childPaths).toContain('projects/:slug');
    expect(childPaths).toContain('blog');
    expect(childPaths).toContain('blog/:slug');
    expect(childPaths).toContain('achievements');
    expect(childPaths).toContain('contact');
  });

  it('should protect admin login with guestGuard', () => {
    const loginRoute = routes.find((r) => r.path === 'admin/login');
    expect(loginRoute).toBeDefined();
    expect(loginRoute?.canActivate).toContain(guestGuard);
  });

  it('should protect admin dashboard with authGuard', () => {
    const adminRoute = routes.find((r) => r.path === 'admin');
    expect(adminRoute).toBeDefined();
    expect(adminRoute?.canActivate).toContain(authGuard);
  });

  it('should configure 404 wildcard route at the end', () => {
    const wildcardRoute = routes.find((r) => r.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(routes[routes.length - 1].path).toBe('**');
  });
});

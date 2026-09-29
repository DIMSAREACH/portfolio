import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should set withCredentials: true on requests', () => {
    http.get('/test').subscribe();

    const req = httpTesting.expectOne('/test');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should attach Bearer token if accessToken exists in AuthService', () => {
    authService.accessToken.set('mock_jwt_token_123');

    http.get('/api/v1/admin/profile').subscribe();

    const req = httpTesting.expectOne('/api/v1/admin/profile');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock_jwt_token_123');
    req.flush({});
  });

  it('should not attach Authorization header if accessToken is null', () => {
    authService.accessToken.set(null);

    http.get('/api/v1/profile').subscribe();

    const req = httpTesting.expectOne('/api/v1/profile');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});

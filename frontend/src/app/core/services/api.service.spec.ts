import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should format URL correctly with base apiUrl', () => {
    const url = service.getUrl('/projects');
    expect(url).toBe(`${environment.apiUrl}/projects`);

    const urlWithoutSlash = service.getUrl('projects/slug');
    expect(urlWithoutSlash).toBe(`${environment.apiUrl}/projects/slug`);
  });

  it('should execute GET request with params', () => {
    service.get<{ success: boolean }>('/projects', { category: 'web', page: 1, empty: '' }).subscribe((res) => {
      expect(res.success).toBe(true);
    });

    const req = httpTesting.expectOne((r) => r.url === `${environment.apiUrl}/projects`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('category')).toBe('web');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.has('empty')).toBe(false);
    expect(req.request.withCredentials).toBe(true);

    req.flush({ success: true });
  });

  it('should execute POST request with body', () => {
    const body = { name: 'Test' };
    service.post<{ id: string }>('/projects', body).subscribe((res) => {
      expect(res.id).toBe('123');
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    expect(req.request.withCredentials).toBe(true);

    req.flush({ id: '123' });
  });

  it('should execute PUT request with body', () => {
    const body = { name: 'Updated' };
    service.put<{ updated: boolean }>('/projects/123', body).subscribe((res) => {
      expect(res.updated).toBe(true);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/projects/123`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);

    req.flush({ updated: true });
  });

  it('should execute PATCH request with body', () => {
    const body = { status: 'published' };
    service.patch<{ patched: boolean }>('/projects/123', body).subscribe((res) => {
      expect(res.patched).toBe(true);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/projects/123`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);

    req.flush({ patched: true });
  });

  it('should execute DELETE request', () => {
    service.delete<{ deleted: boolean }>('/projects/123').subscribe((res) => {
      expect(res.deleted).toBe(true);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/projects/123`);
    expect(req.request.method).toBe('DELETE');

    req.flush({ deleted: true });
  });
});

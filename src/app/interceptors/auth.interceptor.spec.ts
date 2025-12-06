import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;

  beforeEach(() => {
    localStorage.clear();
    
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should not add Authorization header to login requests', () => {
    // Set a token in localStorage to simulate having an old/invalid token
    localStorage.setItem('auth_token', 'old-invalid-token');

    httpClient.post('http://localhost:3000/api/login', {}).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('should not add Authorization header to register requests', () => {
    // Set a token in localStorage to simulate having an old/invalid token
    localStorage.setItem('auth_token', 'old-invalid-token');

    httpClient.post('http://localhost:3000/api/register', {}).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/register');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('should add Authorization header to non-auth requests when token exists', () => {
    localStorage.setItem('auth_token', 'valid-token');

    httpClient.get('http://localhost:3000/api/user').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/user');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer valid-token');
  });

  it('should not add Authorization header when no token exists', () => {
    httpClient.get('http://localhost:3000/api/user').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/user');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('should not logout on 401 error from login endpoint', (done) => {
    spyOn(authService, 'logout');

    httpClient.post('http://localhost:3000/api/login', {}).subscribe({
      error: () => {
        expect(authService.logout).not.toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/login');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should not logout on 401 error from register endpoint', (done) => {
    spyOn(authService, 'logout');

    httpClient.post('http://localhost:3000/api/register', {}).subscribe({
      error: () => {
        expect(authService.logout).not.toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/register');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should logout on 401 error from non-auth endpoint', (done) => {
    spyOn(authService, 'logout');
    localStorage.setItem('auth_token', 'invalid-token');

    httpClient.get('http://localhost:3000/api/user').subscribe({
      error: () => {
        expect(authService.logout).toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/user');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
});

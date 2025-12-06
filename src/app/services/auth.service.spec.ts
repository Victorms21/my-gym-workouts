import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null token when not logged in', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should return false for isAuthenticated when not logged in', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should login successfully', () => {
    const credentials: LoginRequest = { email: 'test@test.com', password: 'password123' };
    const mockResponse: AuthResponse = {
      user: { id: 1, email: 'test@test.com', name: 'Test User' },
      accessToken: 'mock-jwt-token',
      token_type: 'Bearer'
    };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.getToken()).toBe('mock-jwt-token');
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.currentUser()?.email).toBe('test@test.com');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should register successfully', () => {
    const registerData: RegisterRequest = {
      name: 'New User',
      email: 'newuser@test.com',
      password: 'password123'
    };
    const mockResponse: AuthResponse = {
      user: { id: 2, email: 'newuser@test.com', name: 'New User' },
      accessToken: 'new-jwt-token',
      token_type: 'Bearer'
    };

    service.register(registerData).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.getToken()).toBe('new-jwt-token');
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.currentUser()?.name).toBe('New User');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get current user', () => {
    const mockUser = { id: 1, email: 'test@test.com', name: 'Test User' };

    service.getCurrentUser().subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.currentUser()?.email).toBe('test@test.com');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/user');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should logout and clear data', () => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, email: 'test@test.com', name: 'Test' }));

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.currentUser()).toBeNull();
  });
});

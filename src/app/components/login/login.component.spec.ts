import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should have valid form with correct data', () => {
    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should have invalid email field with incorrect email', () => {
    component.loginForm.controls['email'].setValue('invalid-email');
    expect(component.loginForm.controls['email'].valid).toBeFalse();
  });

  it('should have invalid password field when too short', () => {
    component.loginForm.controls['password'].setValue('123');
    expect(component.loginForm.controls['password'].valid).toBeFalse();
  });

  it('should render login form', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="password"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render logo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo')).toBeTruthy();
    expect(compiled.querySelector('.logo-text')?.textContent).toContain('My Gym Workouts');
  });

  it('should render navigation menu with all items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.nav-link');
    expect(navLinks.length).toBe(4);
    expect(navLinks[0].textContent?.trim()).toContain('ROUTINES');
    expect(navLinks[1].textContent?.trim()).toContain('CREATE NEW ROUTINES');
    expect(navLinks[2].textContent?.trim()).toContain('EXERCISES');
    expect(navLinks[3].textContent?.trim()).toContain('MyAccount');
  });

  it('should render banner section with image', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.banner-section')).toBeTruthy();
    expect(compiled.querySelector('.banner-image img')).toBeTruthy();
  });

  it('should render banner CTA button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ctaButton = compiled.querySelector('.banner-cta');
    expect(ctaButton).toBeTruthy();
    expect(ctaButton?.textContent).toContain('START TRAINING');
  });

  it('should render logout button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logout-button')).toBeTruthy();
  });

  it('should set active nav item when clicked', () => {
    component.setActiveNavItem('exercises');
    expect(component.activeNavItem()).toBe('exercises');
  });

  it('should have routines as default active nav item', () => {
    expect(component.activeNavItem()).toBe('routines');
  });
});

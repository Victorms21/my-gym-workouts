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

  it('should render welcome section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.welcome-section')).toBeTruthy();
    expect(compiled.querySelector('h2')?.textContent).toContain('Bienvenido');
  });

  it('should render feature cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const featureCards = compiled.querySelectorAll('.feature-card');
    expect(featureCards.length).toBe(4);
  });

  it('should render logout button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logout-button')).toBeTruthy();
  });
});

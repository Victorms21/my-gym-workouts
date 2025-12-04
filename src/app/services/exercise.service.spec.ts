import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ExerciseService } from './exercise.service';
import { Exercise } from '../models/exercise.model';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let httpMock: HttpTestingController;

  const mockExercise: Exercise = {
    id: '1',
    name: 'Bench Press',
    description: 'A compound chest exercise',
    muscle_group: 'Chest',
    equipment: 'Barbell',
    instructions: 'Lie on bench and press the barbell up',
  };

  const mockExercises: Exercise[] = [
    mockExercise,
    {
      id: '2',
      name: 'Squats',
      description: 'A compound leg exercise',
      muscle_group: 'Legs',
      equipment: 'Barbell',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExerciseService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ExerciseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getExercises', () => {
    it('should fetch all exercises', () => {
      service.getExercises().subscribe((exercises) => {
        expect(exercises).toEqual(mockExercises);
        expect(service.exercises()).toEqual(mockExercises);
        expect(service.exerciseCount()).toBe(2);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/exercises');
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });

    it('should handle error when fetching exercises', () => {
      service.getExercises().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(service.error()).toBeTruthy();
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/exercises');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getExercise', () => {
    it('should fetch a single exercise by ID', () => {
      service.getExercise('1').subscribe((exercise) => {
        expect(exercise).toEqual(mockExercise);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/exercises/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockExercise);
    });

    it('should handle error when exercise not found', () => {
      service.getExercise('999').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/exercises/999');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('clearExercises', () => {
    it('should clear cached exercises', () => {
      // First load exercises
      service.getExercises().subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/exercises');
      req.flush(mockExercises);

      expect(service.exercises().length).toBe(2);

      service.clearExercises();

      expect(service.exercises().length).toBe(0);
      expect(service.loading()).toBeFalse();
      expect(service.error()).toBeNull();
    });
  });
});

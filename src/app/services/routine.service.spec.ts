import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RoutineService } from './routine.service';
import { Routine, CreateRoutineRequest } from '../models/routine.model';

describe('RoutineService', () => {
  let service: RoutineService;
  let httpMock: HttpTestingController;

  const mockRoutine: Routine = {
    id: '1',
    name: 'Push Day',
    description: 'Chest and Triceps workout',
    exercises: [
      {
        id: 'e1',
        name: 'Bench Press',
        sets: [
          { reps: 10, weight: 60, restSeconds: 90 },
          { reps: 8, weight: 70, restSeconds: 90 },
        ],
        notes: 'Focus on form',
      },
    ],
    userId: 'user1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  };

  const mockRoutines: Routine[] = [
    mockRoutine,
    {
      id: '2',
      name: 'Pull Day',
      description: 'Back and Biceps workout',
      exercises: [],
      userId: 'user1',
      createdAt: '2024-01-16T10:30:00Z',
      updatedAt: '2024-01-16T10:30:00Z',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoutineService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(RoutineService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRoutines', () => {
    it('should fetch all routines', () => {
      service.getRoutines().subscribe((routines) => {
        expect(routines).toEqual(mockRoutines);
        expect(service.routines()).toEqual(mockRoutines);
        expect(service.routineCount()).toBe(2);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/routines');
      expect(req.request.method).toBe('GET');
      req.flush(mockRoutines);
    });

    it('should handle error when fetching routines', () => {
      service.getRoutines().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(service.error()).toBeTruthy();
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/routines');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getRoutine', () => {
    it('should fetch a single routine by ID', () => {
      service.getRoutine('1').subscribe((routine) => {
        expect(routine).toEqual(mockRoutine);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/routines/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockRoutine);
    });

    it('should handle error when routine not found', () => {
      service.getRoutine('999').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/routines/999');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createRoutine', () => {
    it('should create a new routine', () => {
      const newRoutine: CreateRoutineRequest = {
        name: 'Leg Day',
        description: 'Legs workout',
        exercises: [
          {
            name: 'Squats',
            sets: [{ reps: 12, weight: 100 }],
          },
        ],
      };

      const createdRoutine: Routine = {
        ...newRoutine,
        id: '3',
        exercises: [
          {
            id: 'e3',
            name: 'Squats',
            sets: [{ reps: 12, weight: 100 }],
          },
        ],
        userId: 'user1',
        createdAt: '2024-01-17T10:30:00Z',
        updatedAt: '2024-01-17T10:30:00Z',
      };

      service.createRoutine(newRoutine).subscribe((routine) => {
        expect(routine).toEqual(createdRoutine);
        expect(service.routines()).toContain(createdRoutine);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/routines');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newRoutine);
      req.flush(createdRoutine);
    });

    it('should handle error when creating routine', () => {
      const newRoutine: CreateRoutineRequest = {
        name: '',
        exercises: [],
      };

      service.createRoutine(newRoutine).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/routines');
      req.flush('Validation error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('clearRoutines', () => {
    it('should clear cached routines', () => {
      // First load routines
      service.getRoutines().subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/routines');
      req.flush(mockRoutines);

      expect(service.routines().length).toBe(2);

      service.clearRoutines();

      expect(service.routines().length).toBe(0);
      expect(service.loading()).toBeFalse();
      expect(service.error()).toBeNull();
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RoutineService } from './routine.service';
import { Routine, CreateRoutineRequest, UpdateRoutineRequest } from '../models/routine.model';

describe('RoutineService', () => {
  let service: RoutineService;
  let httpMock: HttpTestingController;

  const mockRoutine: Routine = {
    id: 1,
    name: 'Full Body Beginner',
    created_at: '2025-12-04T19:57:00.000000Z',
    updated_at: '2025-12-04T19:57:00.000000Z',
    exercises: [
      {
        id: 1,
        name: 'Sentadilla',
        muscle_group_id: 3,
        created_at: '2025-12-04T19:57:00.000000Z',
        updated_at: '2025-12-04T19:57:00.000000Z',
        pivot: {
          routine_id: 1,
          exercise_id: 1,
          sets: 3,
          reps: 10,
          created_at: '2025-12-04T19:57:00.000000Z',
          updated_at: '2025-12-04T19:57:00.000000Z',
        },
      },
      {
        id: 2,
        name: 'Press de banca',
        muscle_group_id: 1,
        created_at: '2025-12-04T19:57:00.000000Z',
        updated_at: '2025-12-04T19:57:00.000000Z',
        pivot: {
          routine_id: 1,
          exercise_id: 2,
          sets: 3,
          reps: 8,
          created_at: '2025-12-04T19:57:00.000000Z',
          updated_at: '2025-12-04T19:57:00.000000Z',
        },
      },
    ],
  };

  const mockRoutines: Routine[] = [
    mockRoutine,
    {
      id: 2,
      name: 'Push Day',
      created_at: '2025-12-04T20:00:00.000000Z',
      updated_at: '2025-12-04T20:00:00.000000Z',
      exercises: [],
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
      service.getRoutine(1).subscribe((routine) => {
        expect(routine).toEqual(mockRoutine);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/routines/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockRoutine);
    });

    it('should handle error when routine not found', () => {
      service.getRoutine(999).subscribe({
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
        exercises: [
          {
            exercise_id: 1,
            sets: 4,
            reps: 12,
          },
        ],
      };

      const createdRoutine: Routine = {
        id: 3,
        name: 'Leg Day',
        created_at: '2025-12-05T10:30:00.000000Z',
        updated_at: '2025-12-05T10:30:00.000000Z',
        exercises: [
          {
            id: 1,
            name: 'Sentadilla',
            muscle_group_id: 3,
            created_at: '2025-12-04T19:57:00.000000Z',
            updated_at: '2025-12-04T19:57:00.000000Z',
            pivot: {
              routine_id: 3,
              exercise_id: 1,
              sets: 4,
              reps: 12,
              created_at: '2025-12-05T10:30:00.000000Z',
              updated_at: '2025-12-05T10:30:00.000000Z',
            },
          },
        ],
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

  describe('updateRoutine', () => {
    it('should update an existing routine', () => {
      // First load routines
      service.getRoutines().subscribe();
      const getReq = httpMock.expectOne('http://localhost:3000/api/routines');
      getReq.flush(mockRoutines);

      const updateData: UpdateRoutineRequest = {
        name: 'Updated Full Body',
      };

      const updatedRoutine: Routine = {
        ...mockRoutine,
        name: 'Updated Full Body',
        updated_at: '2025-12-05T11:00:00.000000Z',
      };

      service.updateRoutine(1, updateData).subscribe((routine) => {
        expect(routine).toEqual(updatedRoutine);
        expect(service.routines().find((r) => r.id === 1)?.name).toBe('Updated Full Body');
      });

      const req = httpMock.expectOne('http://localhost:3000/api/routines/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedRoutine);
    });
  });

  describe('deleteRoutine', () => {
    it('should delete a routine', () => {
      // First load routines
      service.getRoutines().subscribe();
      const getReq = httpMock.expectOne('http://localhost:3000/api/routines');
      getReq.flush(mockRoutines);

      expect(service.routines().length).toBe(2);

      service.deleteRoutine(1).subscribe(() => {
        expect(service.routines().length).toBe(1);
        expect(service.routines().find((r) => r.id === 1)).toBeUndefined();
      });

      const req = httpMock.expectOne('http://localhost:3000/api/routines/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});

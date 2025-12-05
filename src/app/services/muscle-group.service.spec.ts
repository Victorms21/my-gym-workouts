import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MuscleGroupService } from './muscle-group.service';
import { MuscleGroup } from '../models/muscle-group.model';

describe('MuscleGroupService', () => {
  let service: MuscleGroupService;
  let httpMock: HttpTestingController;

  const mockMuscleGroup: MuscleGroup = {
    id: 1,
    name: 'Pecho',
    created_at: '2025-12-04T19:57:00.000000Z',
    updated_at: '2025-12-04T19:57:00.000000Z',
  };

  const mockMuscleGroups: MuscleGroup[] = [
    mockMuscleGroup,
    {
      id: 2,
      name: 'Espalda',
      created_at: '2025-12-04T19:57:00.000000Z',
      updated_at: '2025-12-04T19:57:00.000000Z',
    },
    {
      id: 3,
      name: 'Piernas',
      created_at: '2025-12-04T19:57:00.000000Z',
      updated_at: '2025-12-04T19:57:00.000000Z',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MuscleGroupService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MuscleGroupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMuscleGroups', () => {
    it('should fetch all muscle groups', () => {
      service.getMuscleGroups().subscribe((muscleGroups) => {
        expect(muscleGroups).toEqual(mockMuscleGroups);
        expect(service.muscleGroups()).toEqual(mockMuscleGroups);
        expect(service.muscleGroupCount()).toBe(3);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/muscleGroups');
      expect(req.request.method).toBe('GET');
      req.flush(mockMuscleGroups);
    });

    it('should handle error when fetching muscle groups', () => {
      service.getMuscleGroups().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(service.error()).toBeTruthy();
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/muscleGroups');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getMuscleGroup', () => {
    it('should fetch a single muscle group by ID', () => {
      service.getMuscleGroup(1).subscribe((muscleGroup) => {
        expect(muscleGroup).toEqual(mockMuscleGroup);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/muscleGroups/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockMuscleGroup);
    });

    it('should handle error when muscle group not found', () => {
      service.getMuscleGroup(999).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/muscleGroups/999');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('clearMuscleGroups', () => {
    it('should clear cached muscle groups', () => {
      // First load muscle groups
      service.getMuscleGroups().subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/muscleGroups');
      req.flush(mockMuscleGroups);

      expect(service.muscleGroups().length).toBe(3);

      service.clearMuscleGroups();

      expect(service.muscleGroups().length).toBe(0);
      expect(service.loading()).toBeFalse();
      expect(service.error()).toBeNull();
    });
  });
});

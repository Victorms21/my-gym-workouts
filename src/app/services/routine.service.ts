import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Routine, CreateRoutineRequest, UpdateRoutineRequest } from '../models/routine.model';

@Injectable({
  providedIn: 'root',
})
export class RoutineService {
  private readonly apiUrl = `${environment.apiUrl}/routines`;

  private routinesSignal = signal<Routine[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly routines = this.routinesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly routineCount = computed(() => this.routinesSignal().length);

  constructor(private http: HttpClient) {}

  /**
   * Fetches all routines for the authenticated user
   */
  getRoutines(): Observable<Routine[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Routine[]>(this.apiUrl).pipe(
      tap((routines) => {
        this.routinesSignal.set(routines);
        this.loadingSignal.set(false);
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message || 'Error loading routines');
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetches a single routine by ID
   */
  getRoutine(id: string): Observable<Routine> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Routine>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loadingSignal.set(false);
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message || 'Error loading routine');
        return throwError(() => error);
      })
    );
  }

  /**
   * Creates a new routine
   */
  createRoutine(routine: CreateRoutineRequest): Observable<Routine> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<Routine>(this.apiUrl, routine).pipe(
      tap((newRoutine) => {
        this.routinesSignal.update((routines) => [...routines, newRoutine]);
        this.loadingSignal.set(false);
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message || 'Error creating routine');
        return throwError(() => error);
      })
    );
  }

  /**
   * Updates an existing routine
   */
  updateRoutine(id: string, routine: UpdateRoutineRequest): Observable<Routine> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.put<Routine>(`${this.apiUrl}/${id}`, routine).pipe(
      tap((updatedRoutine) => {
        this.routinesSignal.update((routines) =>
          routines.map((r) => (r.id === id ? updatedRoutine : r))
        );
        this.loadingSignal.set(false);
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message || 'Error updating routine');
        return throwError(() => error);
      })
    );
  }

  /**
   * Deletes a routine
   */
  deleteRoutine(id: string): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.routinesSignal.update((routines) => routines.filter((r) => r.id !== id));
        this.loadingSignal.set(false);
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message || 'Error deleting routine');
        return throwError(() => error);
      })
    );
  }

  /**
   * Clears all cached routines (useful for logout)
   */
  clearRoutines(): void {
    this.routinesSignal.set([]);
    this.loadingSignal.set(false);
    this.errorSignal.set(null);
  }
}

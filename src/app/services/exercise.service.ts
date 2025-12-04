import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private readonly apiUrl = `${environment.apiUrl}/exercises`;

  private exercisesSignal = signal<Exercise[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly exercises = this.exercisesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly exerciseCount = computed(() => this.exercisesSignal().length);

  constructor(private http: HttpClient) {}

  /**
   * Fetches all exercises from the catalog
   */
  getExercises(): Observable<Exercise[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Exercise[]>(this.apiUrl).pipe(
      tap((exercises) => {
        this.exercisesSignal.set(exercises);
        this.loadingSignal.set(false);
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message || 'Error loading exercises');
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetches a single exercise by ID
   */
  getExercise(id: string): Observable<Exercise> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Exercise>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loadingSignal.set(false);
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message || 'Error loading exercise');
        return throwError(() => error);
      })
    );
  }

  /**
   * Clears all cached exercises
   */
  clearExercises(): void {
    this.exercisesSignal.set([]);
    this.loadingSignal.set(false);
    this.errorSignal.set(null);
  }
}

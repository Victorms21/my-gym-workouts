import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MuscleGroup } from '../models/muscle-group.model';

@Injectable({
  providedIn: 'root',
})
export class MuscleGroupService {
  private readonly apiUrl = `${environment.apiUrl}/muscleGroups`;

  private muscleGroupsSignal = signal<MuscleGroup[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly muscleGroups = this.muscleGroupsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly muscleGroupCount = computed(() => this.muscleGroupsSignal().length);

  constructor(private http: HttpClient) {}

  /**
   * Fetches all muscle groups from the catalog
   */
  getMuscleGroups(): Observable<MuscleGroup[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<MuscleGroup[]>(this.apiUrl).pipe(
      tap((muscleGroups) => {
        this.muscleGroupsSignal.set(muscleGroups);
        this.loadingSignal.set(false);
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message || 'Error loading muscle groups');
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetches a single muscle group by ID
   */
  getMuscleGroup(id: number): Observable<MuscleGroup> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<MuscleGroup>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loadingSignal.set(false);
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message || 'Error loading muscle group');
        return throwError(() => error);
      })
    );
  }

  /**
   * Clears all cached muscle groups
   */
  clearMuscleGroups(): void {
    this.muscleGroupsSignal.set([]);
    this.loadingSignal.set(false);
    this.errorSignal.set(null);
  }
}

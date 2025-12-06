import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutineService } from '../../../services/routine.service';
import { Routine } from '../../../models/routine.model';

@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './routines.html',
  styleUrl: './routines.scss',
})
export class RoutinesComponent implements OnInit {
  routines = signal<Routine[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private routineService: RoutineService) {}

  ngOnInit(): void {
    this.loadRoutines();
  }

  loadRoutines(): void {
    this.loading.set(true);
    this.routineService.getRoutines().subscribe({
      next: (routines) => {
        this.routines.set(routines);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 401) {
          this.error.set('Sesión expirada. Por favor, inicia sesión nuevamente.');
          console.error('Error loading routines: 401 Unauthorized - Token invalid or expired');
        } else {
          this.error.set('Error al cargar las rutinas');
          console.error('Error loading routines:', err);
        }
        this.loading.set(false);
      }
    });
  }

  getTotalExercises(routine: Routine): number {
    return routine.exercises?.length || 0;
  }

  getTotalSets(routine: Routine): number {
    return routine.exercises?.reduce((sum, ex) => sum + (ex.pivot?.sets || 0), 0) || 0;
  }

  getUniqueMuscleGroups(routine: Routine): number {
    const muscleGroups = new Set(routine.exercises?.map(ex => ex.muscle_group_id) || []);
    return muscleGroups.size;
  }

  onDeleteRoutine(routine: Routine): void {
    if (confirm(`¿Estás seguro de eliminar la rutina "${routine.name}"?`)) {
      this.routineService.deleteRoutine(routine.id).subscribe({
        next: () => {
          this.loadRoutines();
        },
        error: (err) => {
          console.error('Error deleting routine:', err);
          alert('Error al eliminar la rutina');
        }
      });
    }
  }
}

import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly authService = inject(AuthService);
  activeNavItem = signal<string>('routines');

  setActiveNavItem(item: string): void {
    this.activeNavItem.set(item);
  }

  onStartTraining(): void {
    this.setActiveNavItem('routines');
  }

  onLogout(): void {
    this.authService.logout();
  }
}

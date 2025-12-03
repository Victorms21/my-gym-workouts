import { Component, signal } from '@angular/core';
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
  activeNavItem = signal<string>('routines');

  constructor(public authService: AuthService) {}

  setActiveNavItem(item: string): void {
    this.activeNavItem.set(item);
  }

  onLogout(): void {
    this.authService.logout();
  }
}

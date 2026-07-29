import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly sidebarCollapsed = signal(false);
  readonly mobileMenuOpen = signal(false);
  readonly currentUser = this.authService.currentUser;

  readonly navItems: NavItem[] = [
    { label: 'Tableau de bord', path: '/admin/tableau-de-bord', icon: 'grid' },
    { label: 'Salles', path: '/admin/salles', icon: 'door' },
    { label: 'Réservations', path: '/admin/reservations', icon: 'calendar' },
    { label: 'Problèmes signalés', path: '/admin/problemes', icon: 'alert' },
    { label: 'Avis', path: '/admin/avis', icon: 'star' },
  ];

  toggleSidebar(): void {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  initials(): string {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
  }
}

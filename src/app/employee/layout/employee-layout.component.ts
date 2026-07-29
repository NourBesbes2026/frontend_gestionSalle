import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminLayoutComponent } from '../../admin/layout/layout';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './employee-layout.component.html',
  styleUrl: '../../admin/layout/layout.css',
})
export class EmployeeLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly sidebarCollapsed = signal(false);
  readonly mobileMenuOpen = signal(false);
  readonly currentUser = this.authService.currentUser;
  
   constructor() {
  console.log('EmployeeLayout chargé');
  console.log('User localStorage =', localStorage.getItem('user'));
  console.log('Current User =', this.currentUser());
};

 

  readonly navItems: NavItem[] = [
    { label: 'Salles', path: '/salles', icon: 'door' },
    { label: 'Réserver une salle', path: '/employe/reservations/nouvelle', icon: 'calendar' },
    { label: 'Mes réservations', path: '/employe/reservations', icon: 'calendar' },
    { label: 'Signaler un problème', path: '/employe/problemes', icon: 'alert' },
    { label: 'Donner un avis', path: '/employe/avis', icon: 'star' },
    { label: 'Profil', path: '/profil', icon: 'user' },
    
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

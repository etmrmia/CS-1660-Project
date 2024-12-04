import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  readonly isHomeMenuOpen = signal(false);
  userStore = inject(UserStore);
  user = this.userStore.user;

  constructor(private router: Router) {}

  onLinkClick(link: string) {
    console.log(link);
  }

  setIsHomeMenuOpen() {
    this.isHomeMenuOpen.set(!this.isHomeMenuOpen());
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  loginLogout() {
    if (this.user()) {
      this.userStore.logout();
    }
    this.router.navigate(['/']);
  }
}

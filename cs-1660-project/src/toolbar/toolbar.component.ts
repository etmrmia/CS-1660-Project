import { Component, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatExpansionModule, NgIf],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  readonly isHomeMenuOpen = signal(false);
  user = {
    name: 'John Smith',
    isProfessor: false,
  };

  constructor(private router: Router) {}

  onLinkClick(link: string) {
    console.log(link);
  }

  setIsHomeMenuOpen() {
    this.isHomeMenuOpen.set(!this.isHomeMenuOpen());
  }

  navigateHome() {
    this.router.navigate(['/']);
  }
}

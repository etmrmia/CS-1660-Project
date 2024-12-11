import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  userStore = inject(UserStore);

  constructor(private router: Router) {}

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const validLogin = await this.userStore
        .loadUserInfo(
          this.loginForm.controls['email'].value,
          this.loginForm.controls['password'].value
        )
        .then((val) => {
          if (val) {
            this.router.navigate(['/home']);
          }
        });
    } else {
      console.log('Form is not valid');
    }
  }
}

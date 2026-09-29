import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <h1 class="text-2xl font-bold">Admin Login</h1>
    </div>
  `,
})
export class LoginComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-12 px-4 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Featured Projects</h1>
    </div>
  `,
})
export class ProjectListComponent {}

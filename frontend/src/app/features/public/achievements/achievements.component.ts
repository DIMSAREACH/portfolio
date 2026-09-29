import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-12 px-4 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Achievements & Honors</h1>
    </div>
  `,
})
export class AchievementsComponent {}

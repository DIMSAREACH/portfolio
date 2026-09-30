import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AdminSidebarComponent,
    AdminHeaderComponent,
  ],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <a
        href="#admin-main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-bold text-sm transition-all"
        id="admin-skip-to-content"
      >
        Skip to main content
      </a>

      <!-- Backdrop Overlay for Mobile Drawer -->
      @if (isSidebarOpen) {
        <div
          class="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden transition-opacity"
          (click)="closeSidebar()"
          aria-hidden="true"
        ></div>
      }

      <!-- Admin Sidebar (fixed 260px / w-64) -->
      <app-admin-sidebar
        [isOpen]="isSidebarOpen"
        (closeSidebar)="closeSidebar()"
      ></app-admin-sidebar>

      <!-- Main Layout Body (offset by w-64 on desktop) -->
      <div class="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <!-- Admin Top Navigation Bar -->
        <app-admin-header
          (toggleSidebar)="toggleSidebar()"
        ></app-admin-header>

        <!-- Dynamic Admin Content Router Outlet -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto" id="admin-main-content" tabindex="-1">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  public isSidebarOpen = false;

  public toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  public closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}

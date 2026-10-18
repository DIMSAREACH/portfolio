import { Injectable, inject } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ApiService } from './api.service';
import {
  Profile,
  Project,
  Category,
  Skill,
  Experience,
  Education,
  Certification,
  SocialLink,
  Settings,
  BlogPost,
  ApiResponse,
  PaginatedResponse,
  Message,
  ContactFormPayload,
  DashboardStats,
  Media,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly apiService = inject(ApiService);

  /**
   * Reactive stream fired on every CMS mutation (create/update/delete)
   * Synchronized across components and browser tabs via BroadcastChannel.
   */
  public readonly dataMutated$ = new Subject<{ type: string; id?: string }>();
  private syncChannel?: BroadcastChannel;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.syncChannel = new BroadcastChannel('portfolio_sync_channel');
        this.syncChannel.onmessage = (event) => {
          if (event?.data && event.data.type) {
            this.dataMutated$.next({ type: event.data.type, id: event.data.id });
          }
        };
      } catch {
        // BroadcastChannel unavailable or unsupported in environment
      }
    }
  }

  public notifyMutation(type: string, id?: string): void {
    this.dataMutated$.next({ type, id });
    try {
      if (this.syncChannel) {
        this.syncChannel.postMessage({ type, id, timestamp: Date.now() });
      }
    } catch {
      // Ignore broadcast channel errors
    }
  }

  /**
   * Fetch developer public profile details
   */
  public getProfile(): Observable<ApiResponse<Profile>> {
    return this.apiService.get<ApiResponse<Profile>>('/profile');
  }

  /**
   * Fetch categories with optional type filter ('project' | 'blog' | 'both')
   */
  public getCategories(type?: string): Observable<ApiResponse<Category[]>> {
    return this.apiService.get<ApiResponse<Category[]>>(
      '/categories',
      type ? { type } : undefined,
    );
  }

  /**
   * Fetch published projects with optional filters
   */
  public getProjects(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tech?: string;
    search?: string;
    featured?: boolean | string;
    sort?: string;
  }): Observable<PaginatedResponse<Project>> {
    return this.apiService.get<PaginatedResponse<Project>>('/projects', params);
  }

  /**
   * Fetch featured published projects for home page
   */
  public getFeaturedProjects(limit = 3): Observable<PaginatedResponse<Project>> {
    return this.getProjects({ featured: 'true', limit });
  }

  /**
   * Fetch single published project by slug
   */
  public getProjectBySlug(slug: string): Observable<ApiResponse<Project>> {
    return this.apiService.get<ApiResponse<Project>>(`/projects/${slug}`);
  }

  /**
   * Fetch all visible skills
   */
  public getSkills(category?: string): Observable<ApiResponse<Skill[]>> {
    return this.apiService.get<ApiResponse<Skill[]>>(
      '/skills',
      category ? { category } : undefined,
    );
  }

  /**
   * Fetch experiences sorted by order & start date
   */
  public getExperiences(): Observable<ApiResponse<Experience[]>> {
    return this.apiService.get<ApiResponse<Experience[]>>('/experiences');
  }

  /**
   * Fetch education history
   */
  public getEducation(): Observable<ApiResponse<Education[]>> {
    return this.apiService.get<ApiResponse<Education[]>>('/education');
  }

  /**
   * Fetch professional certifications
   */
  public getCertifications(): Observable<ApiResponse<Certification[]>> {
    return this.apiService.get<ApiResponse<Certification[]>>('/certifications');
  }

  /**
   * Fetch published blog posts
   */
  public getBlogPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    featured?: boolean | string;
  }): Observable<PaginatedResponse<BlogPost>> {
    return this.apiService.get<PaginatedResponse<BlogPost>>('/blog', params);
  }

  /**
   * Fetch single blog post by slug
   */
  public getBlogPostBySlug(slug: string): Observable<ApiResponse<BlogPost>> {
    return this.apiService.get<ApiResponse<BlogPost>>(`/blog/${slug}`);
  }

  /**
   * Fetch visible social links
   */
  public getSocialLinks(): Observable<ApiResponse<SocialLink[]>> {
    return this.apiService.get<ApiResponse<SocialLink[]>>('/social-links');
  }

  /**
   * Fetch public site settings (CV download, contact toggle, etc.)
   */
  public getSettings(): Observable<ApiResponse<Settings>> {
    return this.apiService.get<ApiResponse<Settings>>('/settings/public');
  }

  /**
   * Submit public contact form message
   */
  public submitContact(message: ContactFormPayload): Observable<ApiResponse<Message>> {
    return this.apiService
      .post<ApiResponse<Message>>('/contact', message)
      .pipe(tap(() => this.notifyMutation('message')));
  }

  /**
   * Get direct URL to download CV
   */
  public getCvDownloadUrl(): string {
    return this.apiService.getUrl('/cv/download');
  }

  /**
   * Get direct URL to preview CV in-browser
   */
  public getCvPreviewUrl(): string {
    return this.apiService.getUrl('/cv/preview');
  }

  /**
   * Fetch admin dashboard statistics (PRD Section 9.2, API-015)
   */
  public getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.apiService.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
  }

  /**
   * Admin: List all projects with pagination, status filter, search (PRD 9.4, API-005)
   */
  public getAdminProjects(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    category?: string;
    sort?: string;
  }): Observable<PaginatedResponse<Project>> {
    return this.apiService.get<PaginatedResponse<Project>>('/admin/projects', params);
  }

  /**
   * Admin: Get project by ID (PRD 9.4, API-005)
   */
  public getAdminProjectById(id: string): Observable<ApiResponse<Project>> {
    return this.apiService.get<ApiResponse<Project>>(`/admin/projects/${id}`);
  }

  /**
   * Admin: Create project (PRD 9.4, API-005)
   */
  public createAdminProject(project: Partial<Project> | FormData): Observable<ApiResponse<Project>> {
    return this.apiService
      .post<ApiResponse<Project>>('/admin/projects', project)
      .pipe(tap((res) => this.notifyMutation('project', res?.data?._id)));
  }

  /**
   * Admin: Update project by ID (PRD 9.4, API-005)
   */
  public updateAdminProject(id: string, project: Partial<Project> | FormData): Observable<ApiResponse<Project>> {
    return this.apiService
      .patch<ApiResponse<Project>>(`/admin/projects/${id}`, project)
      .pipe(tap((res) => this.notifyMutation('project', res?.data?._id || id)));
  }

  /**
   * Admin: Delete project by ID (PRD 9.4, API-005)
   */
  public deleteAdminProject(id: string): Observable<ApiResponse<null>> {
    return this.apiService
      .delete<ApiResponse<null>>(`/admin/projects/${id}`)
      .pipe(tap(() => this.notifyMutation('project', id)));
  }

  /**
   * Admin: List all skills with pagination, category filter, search (PRD 9.5, API-006)
   */
  public getAdminSkills(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isVisible?: boolean | string;
  }): Observable<PaginatedResponse<Skill>> {
    return this.apiService.get<PaginatedResponse<Skill>>('/admin/skills', params);
  }

  /**
   * Admin: Get skill by ID (PRD 9.5, API-006)
   */
  public getAdminSkillById(id: string): Observable<ApiResponse<Skill>> {
    return this.apiService.get<ApiResponse<Skill>>(`/admin/skills/${id}`);
  }

  /**
   * Admin: Create skill (PRD 9.5, API-006)
   */
  public createAdminSkill(skill: Partial<Skill>): Observable<ApiResponse<Skill>> {
    return this.apiService
      .post<ApiResponse<Skill>>('/admin/skills', skill)
      .pipe(tap((res) => this.notifyMutation('skill', res?.data?._id)));
  }

  /**
   * Admin: Update skill by ID (PRD 9.5, API-006)
   */
  public updateAdminSkill(id: string, skill: Partial<Skill>): Observable<ApiResponse<Skill>> {
    return this.apiService
      .patch<ApiResponse<Skill>>(`/admin/skills/${id}`, skill)
      .pipe(tap((res) => this.notifyMutation('skill', res?.data?._id || id)));
  }

  /**
   * Admin: Delete skill by ID (PRD 9.5, API-006)
   */
  public deleteAdminSkill(id: string): Observable<ApiResponse<null>> {
    return this.apiService
      .delete<ApiResponse<null>>(`/admin/skills/${id}`)
      .pipe(tap(() => this.notifyMutation('skill', id)));
  }

  /**
   * Admin: List all experiences with pagination and filters (PRD 9.6, API-007)
   */
  public getAdminExperiences(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    isCurrent?: boolean | string;
  }): Observable<PaginatedResponse<Experience>> {
    return this.apiService.get<PaginatedResponse<Experience>>('/admin/experiences', params);
  }

  /**
   * Admin: Get experience by ID (PRD 9.6, API-007)
   */
  public getAdminExperienceById(id: string): Observable<ApiResponse<Experience>> {
    return this.apiService.get<ApiResponse<Experience>>(`/admin/experiences/${id}`);
  }

  /**
   * Admin: Create experience (PRD 9.6, API-007)
   */
  public createAdminExperience(experience: Partial<Experience>): Observable<ApiResponse<Experience>> {
    return this.apiService
      .post<ApiResponse<Experience>>('/admin/experiences', experience)
      .pipe(tap((res) => this.notifyMutation('experience', res?.data?._id)));
  }

  /**
   * Admin: Update experience by ID (PRD 9.6, API-007)
   */
  public updateAdminExperience(id: string, experience: Partial<Experience>): Observable<ApiResponse<Experience>> {
    return this.apiService
      .patch<ApiResponse<Experience>>(`/admin/experiences/${id}`, experience)
      .pipe(tap((res) => this.notifyMutation('experience', res?.data?._id || id)));
  }

  /**
   * Admin: Delete experience by ID (PRD 9.6, API-007)
   */
  public deleteAdminExperience(id: string): Observable<ApiResponse<null>> {
    return this.apiService
      .delete<ApiResponse<null>>(`/admin/experiences/${id}`)
      .pipe(tap(() => this.notifyMutation('experience', id)));
  }

  /**
   * Admin: List all education records with pagination (PRD 9.7, API-008)
   */
  public getAdminEducation(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<PaginatedResponse<Education>> {
    return this.apiService.get<PaginatedResponse<Education>>('/admin/education', params);
  }

  /**
   * Admin: Get education by ID (PRD 9.7, API-008)
   */
  public getAdminEducationById(id: string): Observable<ApiResponse<Education>> {
    return this.apiService.get<ApiResponse<Education>>(`/admin/education/${id}`);
  }

  /**
   * Admin: Create education (PRD 9.7, API-008)
   */
  public createAdminEducation(education: Partial<Education>): Observable<ApiResponse<Education>> {
    return this.apiService
      .post<ApiResponse<Education>>('/admin/education', education)
      .pipe(tap((res) => this.notifyMutation('education', res?.data?._id)));
  }

  /**
   * Admin: Update education by ID (PRD 9.7, API-008)
   */
  public updateAdminEducation(id: string, education: Partial<Education>): Observable<ApiResponse<Education>> {
    return this.apiService
      .patch<ApiResponse<Education>>(`/admin/education/${id}`, education)
      .pipe(tap((res) => this.notifyMutation('education', res?.data?._id || id)));
  }

  /**
   * Admin: Delete education by ID (PRD 9.7, API-008)
   */
  public deleteAdminEducation(id: string): Observable<ApiResponse<null>> {
    return this.apiService
      .delete<ApiResponse<null>>(`/admin/education/${id}`)
      .pipe(tap(() => this.notifyMutation('education', id)));
  }

  /**
   * Admin: List all certifications/awards with pagination (PRD 9.8, API-009)
   */
  public getAdminCertifications(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    isVisible?: boolean | string;
  }): Observable<PaginatedResponse<Certification>> {
    return this.apiService.get<PaginatedResponse<Certification>>('/admin/certifications', params);
  }

  /**
   * Admin: Get certification by ID (PRD 9.8, API-009)
   */
  public getAdminCertificationById(id: string): Observable<ApiResponse<Certification>> {
    return this.apiService.get<ApiResponse<Certification>>(`/admin/certifications/${id}`);
  }

  /**
   * Admin: Create certification (PRD 9.8, API-009)
   */
  public createAdminCertification(cert: Partial<Certification> | FormData): Observable<ApiResponse<Certification>> {
    return this.apiService
      .post<ApiResponse<Certification>>('/admin/certifications', cert)
      .pipe(tap((res) => this.notifyMutation('certification', res?.data?._id)));
  }

  /**
   * Admin: Update certification by ID (PRD 9.8, API-009)
   */
  public updateAdminCertification(id: string, cert: Partial<Certification> | FormData): Observable<ApiResponse<Certification>> {
    return this.apiService
      .patch<ApiResponse<Certification>>(`/admin/certifications/${id}`, cert)
      .pipe(tap((res) => this.notifyMutation('certification', res?.data?._id || id)));
  }

  /**
   * Admin: Delete certification by ID (PRD 9.8, API-009)
   */
  public deleteAdminCertification(id: string): Observable<ApiResponse<null>> {
    return this.apiService
      .delete<ApiResponse<null>>(`/admin/certifications/${id}`)
      .pipe(tap(() => this.notifyMutation('certification', id)));
  }

  /**
   * Admin: List all blog posts with pagination and filters (PRD 9.9, API-010)
   */
  public getAdminBlogPosts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    tag?: string;
    featured?: boolean | string;
  }): Observable<PaginatedResponse<BlogPost>> {
    return this.apiService.get<PaginatedResponse<BlogPost>>('/admin/blog', params);
  }

  /**
   * Admin: Get blog post by ID (PRD 9.9, API-010)
   */
  public getAdminBlogPostById(id: string): Observable<ApiResponse<BlogPost>> {
    return this.apiService.get<ApiResponse<BlogPost>>(`/admin/blog/${id}`);
  }

  /**
   * Admin: Create blog post (PRD 9.9, API-010)
   */
  public createAdminBlogPost(post: Partial<BlogPost> | FormData): Observable<ApiResponse<BlogPost>> {
    return this.apiService
      .post<ApiResponse<BlogPost>>('/admin/blog', post)
      .pipe(tap((res) => this.notifyMutation('blog', res?.data?._id)));
  }

  /**
   * Admin: Update blog post by ID (PRD 9.9, API-010)
   */
  public updateAdminBlogPost(id: string, post: Partial<BlogPost> | FormData): Observable<ApiResponse<BlogPost>> {
    return this.apiService
      .patch<ApiResponse<BlogPost>>(`/admin/blog/${id}`, post)
      .pipe(tap((res) => this.notifyMutation('blog', res?.data?._id || id)));
  }

  /**
   * Admin: Delete blog post by ID (PRD 9.9, API-010)
   */
  public deleteAdminBlogPost(id: string): Observable<ApiResponse<null>> {
    return this.apiService
      .delete<ApiResponse<null>>(`/admin/blog/${id}`)
      .pipe(tap(() => this.notifyMutation('blog', id)));
  }

  /**
   * Admin: Publish blog post by ID (PRD 9.9, API-010)
   */
  public publishAdminBlogPost(id: string): Observable<ApiResponse<BlogPost>> {
    return this.apiService
      .patch<ApiResponse<BlogPost>>(`/admin/blog/${id}/publish`, {})
      .pipe(tap(() => this.notifyMutation('blog', id)));
  }

  /**
   * Admin: Unpublish blog post by ID (PRD 9.9, API-010)
   */
  public unpublishAdminBlogPost(id: string): Observable<ApiResponse<BlogPost>> {
    return this.apiService
      .patch<ApiResponse<BlogPost>>(`/admin/blog/${id}/unpublish`, {})
      .pipe(tap(() => this.notifyMutation('blog', id)));
  }

  // ==========================================
  // Categories (PRD 9.10, API-004)
  // ==========================================

  public getAdminCategories(): Observable<ApiResponse<Category[]>> {
    return this.apiService.get<ApiResponse<Category[]>>('/admin/categories');
  }

  public createAdminCategory(data: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.apiService
      .post<ApiResponse<Category>>('/admin/categories', data)
      .pipe(tap((res) => this.notifyMutation('category', res?.data?._id)));
  }

  public updateAdminCategory(id: string, data: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.apiService
      .patch<ApiResponse<Category>>(`/admin/categories/${id}`, data)
      .pipe(tap((res) => this.notifyMutation('category', res?.data?._id || id)));
  }

  public deleteAdminCategory(id: string): Observable<ApiResponse<null>> {
    return this.apiService
      .delete<ApiResponse<null>>(`/admin/categories/${id}`)
      .pipe(tap(() => this.notifyMutation('category', id)));
  }

  // ==========================================
  // Messages (PRD 9.12, CONTACT-001, API-014)
  // ==========================================

  public getAdminMessages(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isRead?: boolean | string;
    isArchived?: boolean | string;
  }): Observable<PaginatedResponse<Message>> {
    return this.apiService.get<PaginatedResponse<Message>>('/admin/messages', params);
  }

  public getAdminMessageById(id: string): Observable<ApiResponse<Message>> {
    return this.apiService.get<ApiResponse<Message>>(`/admin/messages/${id}`);
  }

  public markAdminMessageAsRead(id: string): Observable<ApiResponse<Message>> {
    return this.apiService
      .patch<ApiResponse<Message>>(`/admin/messages/${id}/read`, {})
      .pipe(tap(() => this.notifyMutation('message', id)));
  }

  public markAdminMessageAsUnread(id: string): Observable<ApiResponse<Message>> {
    return this.apiService
      .patch<ApiResponse<Message>>(`/admin/messages/${id}/unread`, {})
      .pipe(tap(() => this.notifyMutation('message', id)));
  }

  public archiveAdminMessage(id: string): Observable<ApiResponse<Message>> {
    return this.apiService
      .patch<ApiResponse<Message>>(`/admin/messages/${id}/archive`, {})
      .pipe(tap(() => this.notifyMutation('message', id)));
  }

  public deleteAdminMessage(id: string): Observable<ApiResponse<null>> {
    return this.apiService
      .delete<ApiResponse<null>>(`/admin/messages/${id}`)
      .pipe(tap(() => this.notifyMutation('message', id)));
  }

  // ==========================================
  // Profile (PRD 9.15, API-011)
  // ==========================================

  public getAdminProfile(): Observable<ApiResponse<Profile>> {
    return this.apiService.get<ApiResponse<Profile>>('/admin/profile');
  }

  public upsertAdminProfile(data: Partial<Profile> | FormData): Observable<ApiResponse<Profile>> {
    return this.apiService
      .put<ApiResponse<Profile>>('/admin/profile', data)
      .pipe(tap(() => this.notifyMutation('profile')));
  }

  // ==========================================
  // Social Links (PRD 9.14, API-013)
  // ==========================================

  public getAdminSocialLinks(): Observable<ApiResponse<SocialLink[]>> {
    return this.apiService.get<ApiResponse<SocialLink[]>>('/admin/social-links');
  }

  public createAdminSocialLink(data: Partial<SocialLink>): Observable<ApiResponse<SocialLink>> {
    return this.apiService
      .post<ApiResponse<SocialLink>>('/admin/social-links', data)
      .pipe(tap((res) => this.notifyMutation('social-link', res?.data?._id)));
  }

  public updateAdminSocialLink(id: string, data: Partial<SocialLink>): Observable<ApiResponse<SocialLink>> {
    return this.apiService
      .patch<ApiResponse<SocialLink>>(`/admin/social-links/${id}`, data)
      .pipe(tap((res) => this.notifyMutation('social-link', res?.data?._id || id)));
  }

  public deleteAdminSocialLink(id: string): Observable<ApiResponse<null>> {
    return this.apiService
      .delete<ApiResponse<null>>(`/admin/social-links/${id}`)
      .pipe(tap(() => this.notifyMutation('social-link', id)));
  }

  public reorderAdminSocialLinks(linkIds: string[]): Observable<ApiResponse<SocialLink[]>> {
    return this.apiService
      .patch<ApiResponse<SocialLink[]>>('/admin/social-links/reorder', { linkIds })
      .pipe(tap(() => this.notifyMutation('social-link')));
  }

  // ==========================================
  // Media (PRD 9.11, API-015, MEDIA-001)
  // ==========================================

  public getAdminMedia(params?: {
    page?: number;
    limit?: number;
    folder?: string;
    mimeType?: string;
  }): Observable<PaginatedResponse<Media>> {
    return this.apiService.get<PaginatedResponse<Media>>('/admin/media', params);
  }

  public uploadAdminMedia(formData: FormData): Observable<ApiResponse<Media>> {
    return this.apiService
      .post<ApiResponse<Media>>('/admin/media/upload', formData)
      .pipe(tap((res) => this.notifyMutation('media', res?.data?._id)));
  }

  public deleteAdminMedia(id: string): Observable<ApiResponse<null>> {
    return this.apiService
      .delete<ApiResponse<null>>(`/admin/media/${id}`)
      .pipe(tap(() => this.notifyMutation('media', id)));
  }

  // ==========================================
  // CV Management (PRD 9.13, API-016, MEDIA-001)
  // ==========================================

  public getAdminCv(): Observable<ApiResponse<{ cvUrl?: string; cvPublicId?: string; updatedAt?: string }>> {
    return this.apiService.get<ApiResponse<{ cvUrl?: string; cvPublicId?: string; updatedAt?: string }>>('/admin/cv');
  }

  public uploadAdminCv(formData: FormData): Observable<ApiResponse<{ cvUrl: string }>> {
    return this.apiService
      .post<ApiResponse<{ cvUrl: string }>>('/admin/cv/upload', formData)
      .pipe(tap(() => this.notifyMutation('cv')));
  }

  public deleteAdminCv(): Observable<ApiResponse<null>> {
    return this.apiService
      .delete<ApiResponse<null>>('/admin/cv')
      .pipe(tap(() => this.notifyMutation('cv')));
  }

  // ==========================================
  // Settings (PRD 9.16, API-012)
  // ==========================================

  public getAdminSettings(): Observable<ApiResponse<Settings>> {
    return this.apiService.get<ApiResponse<Settings>>('/admin/settings');
  }

  public updateAdminSettings(settings: Partial<Settings>): Observable<ApiResponse<Settings>> {
    return this.apiService
      .put<ApiResponse<Settings>>('/admin/settings', settings)
      .pipe(tap(() => this.notifyMutation('settings')));
  }
}


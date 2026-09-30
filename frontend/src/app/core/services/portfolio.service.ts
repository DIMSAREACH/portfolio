import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly apiService = inject(ApiService);

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
    return this.apiService.post<ApiResponse<Message>>('/contact', message);
  }

  /**
   * Get direct URL to download CV
   */
  public getCvDownloadUrl(): string {
    return this.apiService.getUrl('/cv/download');
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
    return this.apiService.post<ApiResponse<Project>>('/admin/projects', project);
  }

  /**
   * Admin: Update project by ID (PRD 9.4, API-005)
   */
  public updateAdminProject(id: string, project: Partial<Project> | FormData): Observable<ApiResponse<Project>> {
    return this.apiService.patch<ApiResponse<Project>>(`/admin/projects/${id}`, project);
  }

  /**
   * Admin: Delete project by ID (PRD 9.4, API-005)
   */
  public deleteAdminProject(id: string): Observable<ApiResponse<null>> {
    return this.apiService.delete<ApiResponse<null>>(`/admin/projects/${id}`);
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
    return this.apiService.post<ApiResponse<Skill>>('/admin/skills', skill);
  }

  /**
   * Admin: Update skill by ID (PRD 9.5, API-006)
   */
  public updateAdminSkill(id: string, skill: Partial<Skill>): Observable<ApiResponse<Skill>> {
    return this.apiService.patch<ApiResponse<Skill>>(`/admin/skills/${id}`, skill);
  }

  /**
   * Admin: Delete skill by ID (PRD 9.5, API-006)
   */
  public deleteAdminSkill(id: string): Observable<ApiResponse<null>> {
    return this.apiService.delete<ApiResponse<null>>(`/admin/skills/${id}`);
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
    return this.apiService.post<ApiResponse<Experience>>('/admin/experiences', experience);
  }

  /**
   * Admin: Update experience by ID (PRD 9.6, API-007)
   */
  public updateAdminExperience(id: string, experience: Partial<Experience>): Observable<ApiResponse<Experience>> {
    return this.apiService.patch<ApiResponse<Experience>>(`/admin/experiences/${id}`, experience);
  }

  /**
   * Admin: Delete experience by ID (PRD 9.6, API-007)
   */
  public deleteAdminExperience(id: string): Observable<ApiResponse<null>> {
    return this.apiService.delete<ApiResponse<null>>(`/admin/experiences/${id}`);
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
    return this.apiService.post<ApiResponse<Education>>('/admin/education', education);
  }

  /**
   * Admin: Update education by ID (PRD 9.7, API-008)
   */
  public updateAdminEducation(id: string, education: Partial<Education>): Observable<ApiResponse<Education>> {
    return this.apiService.patch<ApiResponse<Education>>(`/admin/education/${id}`, education);
  }

  /**
   * Admin: Delete education by ID (PRD 9.7, API-008)
   */
  public deleteAdminEducation(id: string): Observable<ApiResponse<null>> {
    return this.apiService.delete<ApiResponse<null>>(`/admin/education/${id}`);
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
    return this.apiService.post<ApiResponse<Certification>>('/admin/certifications', cert);
  }

  /**
   * Admin: Update certification by ID (PRD 9.8, API-009)
   */
  public updateAdminCertification(id: string, cert: Partial<Certification> | FormData): Observable<ApiResponse<Certification>> {
    return this.apiService.patch<ApiResponse<Certification>>(`/admin/certifications/${id}`, cert);
  }

  /**
   * Admin: Delete certification by ID (PRD 9.8, API-009)
   */
  public deleteAdminCertification(id: string): Observable<ApiResponse<null>> {
    return this.apiService.delete<ApiResponse<null>>(`/admin/certifications/${id}`);
  }
}

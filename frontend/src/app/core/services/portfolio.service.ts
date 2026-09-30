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
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type HttpParamValue = string | number | boolean | readonly (string | number | boolean)[];

export interface RequestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, HttpParamValue | null | undefined>;
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  /**
   * Build full URL given relative API path
   */
  public getUrl(path: string): string {
    const cleanPath = path.replace(/^\/+/, '');
    return `${this.baseUrl}/${cleanPath}`;
  }

  /**
   * HTTP GET Request
   */
  public get<T>(
    path: string,
    params?: Record<string, HttpParamValue | null | undefined> | HttpParams,
    options?: RequestOptions,
  ): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.get<T>(this.getUrl(path), {
      ...options,
      params: httpParams,
      withCredentials: options?.withCredentials ?? true,
    });
  }

  /**
   * HTTP POST Request
   */
  public post<T>(path: string, body?: unknown, options?: RequestOptions): Observable<T> {
    const httpParams = this.buildParams(options?.params);
    return this.http.post<T>(this.getUrl(path), body, {
      ...options,
      params: httpParams,
      withCredentials: options?.withCredentials ?? true,
    });
  }

  /**
   * HTTP PUT Request
   */
  public put<T>(path: string, body?: unknown, options?: RequestOptions): Observable<T> {
    const httpParams = this.buildParams(options?.params);
    return this.http.put<T>(this.getUrl(path), body, {
      ...options,
      params: httpParams,
      withCredentials: options?.withCredentials ?? true,
    });
  }

  /**
   * HTTP PATCH Request
   */
  public patch<T>(path: string, body?: unknown, options?: RequestOptions): Observable<T> {
    const httpParams = this.buildParams(options?.params);
    return this.http.patch<T>(this.getUrl(path), body, {
      ...options,
      params: httpParams,
      withCredentials: options?.withCredentials ?? true,
    });
  }

  /**
   * HTTP DELETE Request
   */
  public delete<T>(path: string, options?: RequestOptions): Observable<T> {
    const httpParams = this.buildParams(options?.params);
    return this.http.delete<T>(this.getUrl(path), {
      ...options,
      params: httpParams,
      withCredentials: options?.withCredentials ?? true,
    });
  }

  /**
   * Helper to convert plain object to HttpParams, ignoring null/undefined
   */
  private buildParams(
    params?: Record<string, HttpParamValue | null | undefined> | HttpParams,
  ): HttpParams {
    if (!params) {
      return new HttpParams();
    }
    if (params instanceof HttpParams) {
      return params;
    }

    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            httpParams = httpParams.append(key, String(val));
          });
        } else {
          httpParams = httpParams.set(key, String(value));
        }
      }
    });

    return httpParams;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateQuoteDto, PagedResult, QuoteListItem, DashboardMetrics } from '../models/quote.model';

@Injectable({ providedIn: 'root' })
export class Quote {
  private baseUrl = 'http://localhost:5294/api/Quotes';

  constructor(private http: HttpClient) {}

  create(dto: CreateQuoteDto): Observable<{ quoteId: number }> {
    return this.http.post<{ quoteId: number }>(this.baseUrl, dto);
  }

  search(filters: any): Observable<PagedResult<QuoteListItem>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<PagedResult<QuoteListItem>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  update(id: number, dto: CreateQuoteDto) {
    return this.http.put(`${this.baseUrl}/${id}`, dto, { responseType: 'text' });
  }

  recalculate(id: number) {
    return this.http.post(`${this.baseUrl}/${id}/recalculate`, {}, { responseType: 'text' });
  }

  convert(id: number) {
    return this.http.post(`${this.baseUrl}/${id}/convert`, {}, { responseType: 'text' });
  }

  cancel(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  dashboard(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.baseUrl}/dashboard`);
  }
}
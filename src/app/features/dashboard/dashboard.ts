import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Quote } from '../../core/services/quote';
import { Auth } from '../../core/services/auth';
import { DashboardMetrics, QuoteListItem, PagedResult } from '../../core/models/quote.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  metrics: DashboardMetrics | null = null;
  quotes: QuoteListItem[] = [];

  // filters
  searchQuery = '';
  species = '';
  status = '';
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalCount = 0;

  loading = false;

  constructor(
    private quoteService: Quote,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMetrics();
    this.loadQuotes();
  }

  loadMetrics(): void {
    this.quoteService.dashboard().subscribe({
      next: (data) => {
        this.metrics = data;
        this.cdr.markForCheck();
      },
      error: () =>{
        this.metrics = null;
        this.cdr.markForCheck();
      } 
    });
  }

  loadQuotes(): void {
    this.loading = true;
    this.quoteService.search({
      searchQuery: this.searchQuery,
      species: this.species,
      status: this.status,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }).subscribe({
      next: (result: PagedResult<QuoteListItem>) => {
        this.quotes = result.items;
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadQuotes();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.loadQuotes();
  }

  createQuote(): void {
    this.router.navigate(['/quotes/new']);
  }

  viewQuote(id: number): void {
    this.router.navigate(['/quotes', id]);
  }

  editQuote(id: number): void {
    this.router.navigate(['/quotes', id, 'edit']);
  }

  recalculate(id: number): void {
    this.quoteService.recalculate(id).subscribe(() => this.loadQuotes());
  }

  convert(id: number): void {
    if (confirm('Convert this quote to a policy? This action cannot be undone.')) {
      this.quoteService.convert(id).subscribe(() => this.loadQuotes());
    }
  }

  cancelQuote(id: number): void {
    if (confirm('Cancel this quote?')) {
      this.quoteService.cancel(id).subscribe(() => this.loadQuotes());
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
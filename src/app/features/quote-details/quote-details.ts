import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Quote } from '../../core/services/quote';
import { QuoteDetail } from '../../core/models/quote.model';

@Component({
  selector: 'app-quote-details',
  imports: [CommonModule],
  styleUrl: './quote-details.scss',
  templateUrl: './quote-details.html',
})
export class QuoteDetails implements OnInit {
  quote: QuoteDetail | null = null;
  loading = true;
  errorMessage = '';
  successMessage = '';
  actionInProgress = false;
  quoteId!: number;

  showConfirmDialog = false;
  confirmMessage = '';
  private pendingAction: (() => void) | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quoteService: Quote,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.quoteId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuote();
  }

  loadQuote(): void {
    this.loading = true;
    this.quoteService.getById(this.quoteId).subscribe({
      next: (data) => {
        this.quote = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Could not load quote details.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  edit(): void {
    this.router.navigate(['/quotes', this.quoteId, 'edit']);
  }

  recalculate(): void {
    this.actionInProgress = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.quoteService.recalculate(this.quoteId).subscribe({
      next: () => {
        this.actionInProgress = false;
        this.successMessage = 'Premium recalculated successfully.';
        this.loadQuote();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.actionInProgress = false;
        this.errorMessage = err.error?.detail || 'Recalculation failed.';
        this.cdr.markForCheck();
      }
    });
  }

  requestConvert(): void {
    this.confirmMessage = 'Convert this quote to an active policy? This action cannot be undone.';
    this.pendingAction = () => this.doConvert();
    this.showConfirmDialog = true;
  }

  requestCancel(): void {
    this.confirmMessage = 'Cancel this quote? This action cannot be undone.';
    this.pendingAction = () => this.doCancel();
    this.showConfirmDialog = true;
  }

  onConfirmYes(): void {
    this.showConfirmDialog = false;
    this.pendingAction?.();
    this.pendingAction = null;
  }

  onConfirmNo(): void {
    this.showConfirmDialog = false;
    this.pendingAction = null;
  }

  private doConvert(): void {
    this.actionInProgress = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.quoteService.convert(this.quoteId).subscribe({
      next: () => {
        this.actionInProgress = false;
        this.successMessage = 'Quote converted successfully.';
        this.loadQuote();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.actionInProgress = false;
        this.errorMessage = err.error?.detail || 'Conversion failed.';
        this.cdr.markForCheck();
      }
    });
  }

  private doCancel(): void {
    this.actionInProgress = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.quoteService.cancel(this.quoteId).subscribe({
      next: () => {
        this.actionInProgress = false;
        this.successMessage = 'Quote cancelled successfully.';
        this.loadQuote();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.actionInProgress = false;
        this.errorMessage = err.error?.detail || 'Cancellation failed.';
        this.cdr.markForCheck();
      }
    });
  }

  backToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
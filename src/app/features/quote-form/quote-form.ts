import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Quote } from '../../core/services/quote';
import { CreateQuoteDto } from '../../core/models/quote.model';

@Component({
  selector: 'app-quote-form',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './quote-form.scss',
  templateUrl: './quote-form.html',
})
export class QuoteForm implements OnInit {
  quoteForm: FormGroup;
  isEditMode = false;
  quoteId: number | null = null;
  errorMessage = '';
  isSubmitting = false;

  private readonly namePattern = /^[a-zA-Z][a-zA-Z\s.]{0,49}$/;
  private readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  private readonly phonePattern = /^[6-9][0-9]{9}$/;
  private readonly zipPattern = /^[0-9]{6}$/;

  constructor(
    private fb: FormBuilder,
    private quoteService: Quote,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.quoteForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      lastName: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      zipCode: ['', [Validators.required, Validators.pattern(this.zipPattern)]],
      petName: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      species: ['Dog', Validators.required],
      breed: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      dateOfBirth: ['', [Validators.required, this.notFutureDateValidator]],
      gender: ['Unknown', Validators.required],
      hasPreExistingCondition: [false],
      annualLimit: ['', [Validators.required, Validators.min(1), Validators.max(100000)]],
      deductible: ['', [Validators.required, Validators.min(0), Validators.max(10000)]],
      reimbursementPct: ['', [Validators.required, Validators.min(0.1), Validators.max(1)]],
      wellness: [false]
    }, {
      validators: [
        this.deductibleWithinLimitValidator,
        this.bothNamesSingleLetterValidator
      ]
    });
  }

  private notFutureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return selectedDate > today ? { futureDate: true } : null;
  }

  private deductibleWithinLimitValidator(group: AbstractControl): ValidationErrors | null {
    const annualLimit = group.get('annualLimit')?.value;
    const deductible = group.get('deductible')?.value;
    if (annualLimit != null && annualLimit !== '' && deductible != null && deductible !== '' && Number(deductible) > Number(annualLimit)) {
      return { deductibleExceedsLimit: true };
    }
    return null;
  }

  // New rule: firstName AND lastName cannot BOTH be single letters
  private bothNamesSingleLetterValidator(group: AbstractControl): ValidationErrors | null {
    const firstName = (group.get('firstName')?.value || '').trim();
    const lastName = (group.get('lastName')?.value || '').trim();
    if (firstName.length === 1 && lastName.length === 1) {
      return { bothNamesTooShort: true };
    }
    return null;
  }

  blockInvalidNumberKeys(event: KeyboardEvent): void {
    const blockedKeys = ['-', '+', 'e', 'E'];
    if (blockedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.quoteId = +idParam;
      this.loadQuote(this.quoteId);
    }
  }

  loadQuote(id: number): void {
    this.quoteService.getById(id).subscribe({
      next: (data) => {
        const formatted = {
          ...data,
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : ''
        };
        this.quoteForm.patchValue(formatted);
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Could not load quote details.';
        this.cdr.markForCheck();
      }
    });
  }

  get f() {
    return this.quoteForm.controls;
  }

  onSubmit(): void {
  if (this.quoteForm.invalid) {
    this.quoteForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  this.errorMessage = '';
  const dto: CreateQuoteDto = this.quoteForm.value;

  if (this.isEditMode && this.quoteId) {
    this.quoteService.update(this.quoteId, dto).subscribe({
      next: () => this.onSaveSuccess(),
      error: (err) => this.onSaveError(err)
    });
  } else {
      this.quoteService.create(dto).subscribe({
        next: () => this.onSaveSuccess(),
        error: (err) => this.onSaveError(err)
      });
    }
  }

private onSaveSuccess(): void {
  this.isSubmitting = false;
  this.router.navigate(['/dashboard']);
}

private onSaveError(err: unknown): void {
  this.isSubmitting = false;
  const httpError = err as { error?: { detail?: string } };
  this.errorMessage = httpError.error?.detail || 'Failed to save quote. Please check your input.';
  this.cdr.markForCheck();
}
    

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
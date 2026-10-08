import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Excel } from '../../core/services/excel';

interface ImportResult {
  message: string;
  importedQuotes: number;
  importedCustomers: number;
  importedPets: number;
}

@Component({
  selector: 'app-excel-import-export',
  imports: [CommonModule],
  styleUrl: './excel-import-export.scss',
  templateUrl: './excel-import-export.html',
})
export class ExcelImportExport {
  isExporting = false;
  isImporting = false;
  selectedFile: File | null = null;
  importResult: ImportResult | null = null;
  errorMessage = '';

  constructor(
    private excelService: Excel,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  exportQuotes(): void {
    this.isExporting = true;
    this.errorMessage = '';
    this.excelService.export().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PetInsuranceExport_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isExporting = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isExporting = false;
        this.errorMessage = 'Export failed. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.importResult = null;
      this.errorMessage = '';
    }
  }

  importQuotes(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a .xlsx file first.';
      return;
    }

    this.isImporting = true;
    this.errorMessage = '';
    this.importResult = null;

    this.excelService.import(this.selectedFile).subscribe({
      next: (result: ImportResult) => {
        this.importResult = result;
        this.isImporting = false;
        this.selectedFile = null;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isImporting = false;
        this.errorMessage = err.error?.detail || err.error?.message || 'Import failed. Please check the file format.';
        this.cdr.markForCheck();
      }
    });
  }

  backToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
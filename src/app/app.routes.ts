import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { QuoteForm } from './features/quote-form/quote-form';
import { QuoteDetails } from './features/quote-details/quote-details';
import { ExcelImportExport } from './features/excel-import-export/excel-import-export';
import { authGuard, guestGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'quotes/new', component: QuoteForm, canActivate: [authGuard] },
  { path: 'quotes/:id/edit', component: QuoteForm, canActivate: [authGuard] },
  { path: 'quotes/:id', component: QuoteDetails, canActivate: [authGuard] },
  { path: 'excel', component: ExcelImportExport, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
# 🐾 Pet Insurance Quote Management System — Angular UI

[![Angular](https://img.shields.io/badge/Framework-Angular%2019-DD0031?style=flat-square&logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/Styling-SCSS-CC6699?style=flat-square&logo=sass)](https://sass-lang.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

An enterprise Angular single-page web application (SPA) providing intuitive interfaces for customer quote generation, dynamic risk calculation, quote lifecycle management (`Active` ➡️ `Converted` / `Expired` / `Cancelled`), and bulk Excel import/export.

---

## 📋 Table of Contents

- [1. Overview & Key Features](#1-overview--key-features)
- [2. System Architecture & Project Structure](#2-system-architecture--project-structure)
- [3. Prerequisites & Setup Instructions](#3-prerequisites--setup-instructions)
- [4. Screen & Component Guide](#4-screen--component-guide)
- [5. Reactive Forms & Validation Rules](#5-reactive-forms--validation-rules)
- [6. API Integration & Interceptors](#6-api-integration--interceptors)
- [7. Available Scripts](#7-available-scripts)

---

## 1. Overview & Key Features

### Core Features
- 📊 **Interactive Quote Dashboard**: Live summary metrics (Total Quotes, Active, Converted, Expired, Average Premium) and paginated data grid.
- 🔍 **Multi-Parametric Search & Date Filtering**: Search by Customer Name, Email, or Quote # with built-in date-range pickers ("From Date" & "To Date").
- ✍️ **Reactive Form Quote Builder**: Client-side validation with regex checks for Customer, Pet, and Coverage details.
- 💰 **Dynamic Premium Recalculation**: Instant premium adjustment with discount toggle and live recalculation updates.
- 📁 **Excel Batch Import & Export**: Import bulk quotes from `.xlsx` workbooks and export generated quotes with a single click.
- 🔐 **JWT Authentication & Route Protection**: Guarded navigation (`authGuard`, `guestGuard`) with HTTP Bearer token interceptor (`jwtInterceptor`).

---

## 2. System Architecture & Project Structure

```
PetInsurance-UI/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/          # Auth & Guest Route Guards
│   │   │   ├── interceptors/    # JWT Bearer HttpInterceptorFn
│   │   │   ├── models/          # TypeScript Interfaces & DTOs
│   │   │   └── services/        # Auth, Quote, and Excel HttpClient Services
│   │   ├── features/
│   │   │   ├── login/           # User Authentication Component
│   │   │   ├── dashboard/       # Summary Metrics & Data Grid
│   │   │   ├── quote-form/      # Create / Edit Reactive Form
│   │   │   ├── quote-details/   # Detailed View & Actions
│   │   │   └── excel-import-export/ # Excel Batch Upload/Download
│   │   ├── app.config.ts        # App Providers & HttpClient Setup
│   │   └── app.routes.ts        # Angular Router Configuration
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 3. Prerequisites & Setup Instructions

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Angular CLI**: v19.x or higher (`npm install -g @angular/cli`)
- **Backend API**: ASP.NET Core API running on `http://localhost:5294`

### Installation Steps

1. Navigate to the frontend directory:
   ```bash
   cd d:\Dotnet\frontend\PetInsurance-UI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Angular development server:
   ```bash
   npm start
   ```
   *or*
   ```bash
   ng serve
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:4200/
   ```

---

## 4. Screen & Component Guide

### 🔑 Login (`/login`)
- Authenticate with username (`admin`) and password (`Password123!`).
- Stores JWT token in `localStorage` and redirects to `/dashboard`.

### 📊 Quote Dashboard (`/dashboard`)
- Real-time summary cards: Total Quotes, Active, Converted, Expired, Average Premium.
- Filter toolbar: Search text, Species dropdown (Dog/Cat), Status dropdown, From Date, To Date.
- Action buttons per quote row: **View**, **Edit**, **Recalc**, **Convert**, **Cancel**.

### 📝 Create / Edit Quote (`/quotes/new` & `/quotes/:id/edit`)
- **Customer Section**: First Name, Last Name, Email, Phone, Zip Code.
- **Pet Section**: Pet Name, Species, Breed, Date of Birth, Gender, Pre-existing Condition.
- **Coverage Section**: Annual Limit ($), Deductible ($), Reimbursement %, Wellness Add-on.

### 🔍 Quote Details (`/quotes/:id`)
- Complete Breakdown: Base Premium, Age Adjustment (+), Wellness Amount (+), Multi-Pet Discount (-), Final Premium.
- Direct Actions: Edit, Recalculate Premium, Convert Quote, Cancel Quote.

### 📂 Excel Import/Export (`/excel`)
- **Upload**: Import bulk quotes from `.xlsx` workbooks.
- **Download**: Export current database quotes to formatted Excel spreadsheets.

---

## 5. Reactive Forms & Validation Rules

| Field | Rule / Regex | Error Message |
| :--- | :--- | :--- |
| `firstName` / `lastName` | `/^[a-zA-Z][a-zA-Z\s.'-]{0,49}$/` | Letters only. Cannot both be single letters. |
| `email` | Standard RFC email regex | Enter a valid email address. |
| `phone` | `/^[6-9][0-9]{9}$/` | Enter a valid 10-digit mobile number. |
| `zipCode` | `/^[0-9]{6}$/` | Enter a valid 6-digit ZIP code. |
| `dateOfBirth` | Past or today's date | Date of birth cannot be in the future. |
| `annualLimit` | Min: $1, Max: $100,000 | Must be between 1 and 100,000. |
| `deductible` | Min: $0, Max: $10,000 | Cannot exceed Annual Limit. |
| `reimbursementPct` | Min: 0.1, Max: 100 | Must be between 0.1 and 100. |

---

## 6. API Integration & Interceptors

All outbound HTTP requests automatically attach the stored JWT Bearer Token via `jwtInterceptor`:

```typescript
// Core endpoint base URL
private baseUrl = 'http://localhost:5294/api';
```

- If an HTTP `401 Unauthorized` response is intercepted, the app automatically clears session tokens and redirects the user to `/login`.

---

## 7. Available Scripts

| Command | Action |
| :--- | :--- |
| `npm start` | Starts local dev server at `http://localhost:4200` |
| `ng build` | Compiles production build into `dist/` |
| `ng test` | Runs unit tests using test runner |

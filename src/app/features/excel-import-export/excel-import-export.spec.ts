import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExcelImportExport } from './excel-import-export';

describe('ExcelImportExport', () => {
  let component: ExcelImportExport;
  let fixture: ComponentFixture<ExcelImportExport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelImportExport],
    }).compileComponents();

    fixture = TestBed.createComponent(ExcelImportExport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

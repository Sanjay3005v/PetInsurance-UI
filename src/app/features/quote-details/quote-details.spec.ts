import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteDetails } from './quote-details';

describe('QuoteDetails', () => {
  let component: QuoteDetails;
  let fixture: ComponentFixture<QuoteDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

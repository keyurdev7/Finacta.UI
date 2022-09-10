import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPaymentListComponent } from './company-payment-list.component';

describe('CompanyPaymentListComponent', () => {
  let component: CompanyPaymentListComponent;
  let fixture: ComponentFixture<CompanyPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyPaymentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandelSubscriptionDialogComponent } from './candel-subscription-dialog.component';

describe('CandelSubscriptionDialogComponent', () => {
  let component: CandelSubscriptionDialogComponent;
  let fixture: ComponentFixture<CandelSubscriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandelSubscriptionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandelSubscriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

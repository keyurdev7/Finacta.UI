import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPromocodeComponent } from './add-edit-promocode.component';

describe('AddEditPromocodeComponent', () => {
  let component: AddEditPromocodeComponent;
  let fixture: ComponentFixture<AddEditPromocodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPromocodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPromocodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

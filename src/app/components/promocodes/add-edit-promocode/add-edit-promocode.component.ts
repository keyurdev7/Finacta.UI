import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PromoCode } from 'src/app/models/promo-code.model';
import { PromoCodeForm } from 'src/app/models/promo-code-form.model';
import { PromocodeService } from 'src/app/shared/services/promocode.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-edit-promocode',
  templateUrl: './add-edit-promocode.component.html',
  styleUrls: ['./add-edit-promocode.component.scss'],
})
export class AddEditPromocodeComponent implements OnInit {
  promoCodeForm: FormGroup = new FormGroup([]);
  constructor(
    @Inject(MAT_DIALOG_DATA) public codeData: PromoCode,
    public dialogRef: MatDialogRef<AddEditPromocodeComponent>,
    private fb: FormBuilder,
    public promoCodeService: PromocodeService,
    public toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.promoCodeForm = this.fb.group({
      promoCode: [
        this.codeData && this.codeData.promoCode
          ? this.codeData.promoCode
          : null,
        [Validators.required],
      ],
      days: [
        this.codeData && this.codeData.promoDays
          ? this.codeData.promoDays
          : null,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      email: [
        this.codeData && this.codeData.emailId ? this.codeData.emailId : null,
        [Validators.required, Validators.email],
      ],
    });
  }

  hasError(control: string, validator: string): boolean {
    return (
      this.promoCodeForm.controls[control]?.touched &&
      this.promoCodeForm.controls[control].errors?.[validator]
    );
  }

  add(): void {
    const data = new PromoCodeForm();
    data.PromoCode = this.promoCodeForm.value.promoCode;
    data.EmailId = this.promoCodeForm.value.email;
    data.PromoDays = this.promoCodeForm.value.days;

    this.promoCodeService.addPromoCode(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.promoCodeForm.reset();
        this.dialogRef.close({ event: 'success', data: parseInt(res.data) });
        this.toster.success(res.message);
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  update(): void {
    const data = new PromoCodeForm();
    data.PromoCodeId = this.codeData.promoCodeId;
    data.PromoCode = this.promoCodeForm.value.promoCode;
    data.EmailId = this.promoCodeForm.value.email;
    data.PromoDays = this.promoCodeForm.value.days;

    this.promoCodeService.updatePromoCode(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.promoCodeForm.reset();
        this.dialogRef.close({ event: 'success', data: parseInt(res.data) });
        this.toster.success(res.message);
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

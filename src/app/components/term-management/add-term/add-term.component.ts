import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Term } from 'src/app/models/term.model';
import { TermService } from 'src/app/shared/services/term.service';
import { ToastrService } from 'ngx-toastr';
import { AddEditTermForm } from 'src/app/models/add-edit-term';

@Component({
  selector: 'app-add-term',
  templateUrl: './add-term.component.html',
  styleUrls: ['./add-term.component.scss']
})
export class AddTermComponent implements OnInit {
  public termForm : FormGroup  = new FormGroup([]); 

  constructor(
     @Inject(MAT_DIALOG_DATA) public termData: Term,
    public dialogRef: MatDialogRef<AddTermComponent>,
    private termService: TermService,
    private fb: FormBuilder,
    public toster: ToastrService
  ) { }

  ngOnInit(): void {
    this.termForm = this.fb.group({
      termTitle: [
        !!this.termData ? this.termData.termTitle : null,
        [Validators.required]],
      termContent: [
        !!this.termData ? this.termData.termContent : null,
        [Validators.required]],
    });
  }

  hasError(control: string, validator: string): boolean {
    return (
      this.termForm.controls[control]?.touched &&
      this.termForm.controls[control].errors?.[validator]
    );
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  addTerm(): void {
    const data = new AddEditTermForm();
    data.termTitle = this.termForm.value.termTitle;
    data.termContent = this.termForm.value.termContent;

    this.termService.addTerm(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.termForm.reset();
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

  updateTerm(): void {
    const data = new AddEditTermForm();
    data.termId = this.termData.termId;
    data.termTitle = this.termForm.value.termTitle;
    data.termContent = this.termForm.value.termContent;
    
    this.termService.updateTerm(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.termForm.reset();
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
}

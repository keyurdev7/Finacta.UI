import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-company-user-verification',
  templateUrl: './company-user-verification.component.html',
  styleUrls: ['./company-user-verification.component.scss'],
})
export class CompanyUserVerificationComponent implements OnInit {
  public isVerified: boolean = false;
  public verificationFailed: boolean = false;
  constructor(
    private api: APIService,
    private activatedRoute: ActivatedRoute,
    public toster: ToastrService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      ///const param = encodeURIComponent(params['param']).replace(/'/g,"%27").replace(/"/g,"%22");
      this.api.companyUserVerify(params['param']).subscribe((res) => {
        if (res && res.succeeded) {
          this.isVerified = true;
          if (!!res.data.IsRedirectToResetPassword) {
            this.toster
              .success('User Verified Successfully')
              .onHidden.subscribe((hide) => {
                this.router.navigate(['/auth/setpassword/' + res.data.userId]);
              });
          } else {
            this.toster
              .success('User Verified Successfully')
              .onHidden.subscribe((hide) => {
                this.router.navigate(['/auth/login']);
              });
          }
        } else if (res && res.errors.length) {
          this.isVerified = false;
          this.verificationFailed = true;
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        }
      });
    });
  }
}

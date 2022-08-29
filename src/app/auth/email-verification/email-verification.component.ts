import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {
  public isVerified: boolean = false;

  constructor(
    private api: APIService,
    private activatedRoute: ActivatedRoute,
    public toster: ToastrService,
    public router: Router
  ) {
    document.querySelector('body')?.classList.add('login-img');

    this.activatedRoute.queryParams.subscribe((params) => {
      const token = params['param'];
      this.api.emailVerify(token).subscribe((res) => {
        if (res && res.succeeded) {
          this.isVerified = true;
          this.toster.success(res.message).onHidden.subscribe((hide) => {
            this.router.navigate(['/auth/login']);
          });
        } else if (res && res.errors.length) {
          this.isVerified = false;
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
            this.router.navigate(['/auth/login']);
          });
        }
      });
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    document.querySelector('body')?.classList.remove('login-img');
  }
}

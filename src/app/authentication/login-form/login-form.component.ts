import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  error: boolean = false;
  errorMessage: String = '';
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.form = this.initForm();
  }

  submit(): void {
    if (this.form.valid) {
      const email = this.form.get('email').value;
      const password = this.form.get('password').value;
      this.authService.logIn(email, password)
        .subscribe(data => {
          this.error = false;
          this.router.navigate(['/home'])
          this.form.reset()
        },err => {
            this.error = true;
            this.errorMessage = err.error.message;
          }
        );
    }
  }

  // tslint:disable-next-line: typedef
  private initForm() {
    return this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
  }
}

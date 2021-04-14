import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from '../../user.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  form: FormGroup;
  error: boolean = false;
  errorMessage: String = 'Test';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.form = this.initForm();
  }

  submit(): void {
      if (this.form.valid) {
        const username = this.form.get('username').value;
        const email = this.form.get('email').value;
        const password = this.form.get('password').value;
  
        this.authService.singIn(username, email, password)
        .subscribe((user: User) => {
            // si compte crée avec succèes, on se connecte directement sur le compte
            this.authService.logIn(email, password)
              .subscribe(data => {
                this.router.navigate(['/home']);
              });
        }, error => {
            this.error = true;
            this.errorMessage = error.error.message;
        });
      }
  }

  // Pour la partie confirm password, on s'est basé à partir des sites suivants:
  // https://stackoverflow.com/questions/66325338/angular-11-forms-confirm-password-field-without-making-a-formgroup-or-using-form
  // https://jasonwatmore.com/post/2020/07/07/angular-10-reactive-forms-validation-example
  private initForm() {
    return this.formBuilder.group({
      username: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: [null, Validators.required]
    },
    {
      validators: this.confirmPasswordValidator('password', 'confirmPassword')
    });
  }

  private confirmPasswordValidator = (passwordKey: string, confirmPasswordKey: string) => (formGroup: FormGroup) => {
    const passwordControl = formGroup.controls[passwordKey];
    const confirmPasswordControl = formGroup.controls[confirmPasswordKey];

    if (confirmPasswordControl.errors && !confirmPasswordControl.errors.mustMatch) {
      return;
    }

    confirmPasswordControl.setErrors(passwordControl.value !== confirmPasswordControl.value ? { mustMatch: true } : null);
  };
}

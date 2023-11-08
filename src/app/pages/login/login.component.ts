import { Component, OnInit } from '@angular/core';
import { UserLoginModel } from 'src/app/models/user-login.model';
import { SessionService } from 'src/app/services/session.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ResponseModel } from 'src/app/models/response.model';
import { TokenRefreshRequestModel } from 'src/app/models/token-refreshtoken.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formLogin: FormGroup;
  public loading = false;

  regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,30}$/;

  constructor(
    private sessionService: SessionService,
    private formBuilder: FormBuilder,
    private router: Router
    ) {
      this.formLogin = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern(this.regex)]]
      });
  }

  ngOnInit(): void {
  }

  submitLogin() {
    let userLogin = new UserLoginModel();
    userLogin.email = this.formLogin.get('email')?.value;
    userLogin.password = this.formLogin.get('password')?.value;
    this.loading = true;
    this.sessionService.login(userLogin)
      .subscribe({
        next: async (res: ResponseModel) => {
          this.loading = false;
          let data: TokenRefreshRequestModel = res.data;
          this.sessionService.registerTokenRefreshToken(data);
          this.router.navigate(['/home']);
        },
        error: async (err) => {
          this.loading = false;
          alert('Login deu errado');
        }
      });
  }

}

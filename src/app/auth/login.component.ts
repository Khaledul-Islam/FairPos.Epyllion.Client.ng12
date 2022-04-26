import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { AuthenticationService } from './authentication.service';
import { AppComponent } from '@app/app.component';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public CounterList = [];
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private myapp: AppComponent
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.UserCounterDDL();
    this.myapp.logout_in_trigger();
  }

  UserCounterDDL() {
    this.http.get(this.env.apiUrl + 'api/Account/select_all_active_counter').subscribe(
      (result) => {
        this.CounterList = result as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }

  login() {
    this.isLoading = true;
    const login$ = this.authenticationService.login(this.loginForm.value);
    login$
      .pipe(
        finalize(() => {
          debugger;
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (credentials) => {
          if (credentials.isActive) {
            // log.debug(`${credentials.username} successfully logged in`);
            // this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
            // this.myapp.logout_in_trigger();
            // location.reload();
            location.href = '/';
          } else {
            this.alertService.error('Another User Already Logged in this Counter');
          }
        },
        (error) => {
          this.error = error;
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      CounterId: [1, Validators.required],
      remember: true,
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/front-office/services/auth.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,

  ) {}




  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }
    this.loadingService.show();  // <- Show loading

    const credentials = this.loginForm.value;
  
    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/userprofile']);
        this.loadingService.hide();  // <- Hide loading

      },
      error: (err) => {
        console.error(err);
        const errorMsg = err.error?.message || 'Login failed. Please try again.';
        alert('Login failed: ' + errorMsg);
        this.loadingService.hide();  // <- Hide loading

      },
    });
  }
  
}
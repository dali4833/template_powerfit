import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/front-office/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
  
    const credentials = this.loginForm.value;
  
    this.authService.login(credentials).subscribe({
      next: () => {
        alert('Login successful!');
        this.router.navigate(['/userprofile']);
      },
      error: (err) => {
        console.error(err);
        alert('Login failed: ' + (err.error?.message || 'Invalid credentials'));
      },
    });
    
    
  }
  
}
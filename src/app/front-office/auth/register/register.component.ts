import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/front-office/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      alert('Please fill out the form correctly');
      return;
    }
  
    const { name, email, password, confirmPassword } = this.registerForm.value;
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    const user = {
      name,
      email,
      password,
      roles: 'ROLE_USER',
      user_type: 'UserInfo'
    };
    this.authService.register(user).subscribe({
      next: (response: any) => {
        alert(response); // This will be "User Added Successfully"
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert('Error: ' + (err.error?.message || 'Registration failed!'));
      }
    });
    
    
    
  }
  

}
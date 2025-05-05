import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html'
})
export class UserprofileComponent implements OnInit {
  profileMessage: string = '';
  coachForm: FormGroup;
  generatedPassword: string = '';
  clubId: number | null = null;
  clubName: string = '';
  username: string = '';
  email: string = '';
  role: string = '';
  isCoach: boolean = false;
  isNutritionist: boolean = false;
  isUser: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.coachForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnInit(): void {
    const roleFromToken = this.authService.getRoleFromToken();
    if (roleFromToken) {
      this.role = roleFromToken;
    } else {
      console.error('Failed to get role from token.');
    }

    this.authService.getUserProfileBsic().subscribe({
      next: (res: any) => {
        this.email = res.email || '';
        this.username = res.username || '';

        switch (this.role) {
          case 'ROLE_COACH':
            this.isNutritionist = true;
            this.profileMessage = `Welcome Coach — ${this.email}`;
            break;
          case 'ROLE_NUTRITIONIST':
            this.isCoach = true;

            this.profileMessage = `Welcome Nutritionist — ${this.email}`;
            break;
          case 'ROLE_USER':
            this.isUser = true;
            this.profileMessage = `Welcome User — ${this.email}`;
            break;

        }
      },
      error: (_) => {
        // If not a coach, fall back to club owner
        this.authService.getUserProfile().subscribe({
          next: (res: any) => {
            this.username = res.username;
            this.clubId = res.clubId;
            this.clubName = res.clubName;
            this.profileMessage = `Welcome ${this.username} — Club: ${this.clubName || 'No club associated'}`;
          },
          error: (err) => {
            console.error('Error fetching profile:', err);
            this.profileMessage = 'Failed to load profile';
          }
        });
      }
    });
  }

  generatePassword(): void {
    this.generatedPassword = this.authService.generateRandomPassword();
  }

  addCoach(): void {
    if (this.coachForm.invalid || !this.generatedPassword || !this.clubId) return;

    const coach = {
      name: this.coachForm.value.name,
      email: this.coachForm.value.email,
      password: this.generatedPassword,
      roles: 'ROLE_COACH',
      user_type: 'COACH'
    };

    this.authService.addUserToClub(coach, this.clubId).subscribe({
      next: (res: string) => {
        alert(res);
        if (res.includes('successfully') || res.includes('added')) {
          this.coachForm.reset();
          this.generatedPassword = '';
        }
      },
      error: (err) => {
        console.error('Error adding coach:', err);
        alert('Something went wrong while adding the coach.');
      }
    });
  }
}

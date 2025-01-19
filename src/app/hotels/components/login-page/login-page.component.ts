import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  constructor(private router: Router) {}

  selectedRole: string = '';

  onLogin(): void {
    if (!this.selectedRole) {
      alert('Please select a role.');
      return;
    }

    // Redirect based on selected role
    if (this.selectedRole === 'admin') {
      this.router.navigate(['/hotels/admin']); // Replace with the actual route for admin
    } else if (this.selectedRole === 'user') {
      this.router.navigate(['/hotels']); // Replace with the actual route for user
    } else {
      alert('Invalid role selected!');
    }
  }
}

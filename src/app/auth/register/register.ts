import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../auth'; // adjust the path based on your project

@Component({
  selector: 'app-register',
  standalone: true, // 👈 important for standalone components
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = '';
  email = '';
  password = '';
  message = '';

  constructor(private auth: Auth, private router: Router) {}

  async register() {
    try {
      await this.auth.register(this.username, this.email, this.password);
      this.message = 'Registered successfully!';
      this.router.navigate(['/dashboard']);


    } catch (e: any) {
      this.message = 'Registration failed: ' + (e.response?.data || e.message);
    }
  }
}

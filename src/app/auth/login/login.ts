import { Component } from '@angular/core';
import {Auth} from '../../auth';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  message = '';

  constructor(private auth: Auth, private router: Router) {}

  async login() {
    try {
      await this.auth.login(this.email, this.password);
      this.message = 'Login successfully!';
      this.router.navigate(['/dashboard']);
    } catch (error) {
      alert('Invalid email or password.');
    }
  }


}

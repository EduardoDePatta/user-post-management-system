import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginType } from './types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  constructor(
    private router: Router
  ) {}

  login: LoginType = {
    user: '',
    password: ''
  }

  onLogin() {
    if (this.login.user === 'admin' && this.login.password === '334455') {
      this.router.navigateByUrl('/users')
    } else {
      alert('aaaa')
    }
  }
}

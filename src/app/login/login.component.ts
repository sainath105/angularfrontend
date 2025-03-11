import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private http: HttpClient) { console.log('LoginComponent loaded');}

  
    // Simple hardcoded credentials for demo purpose
    login() {
      this.http.post('http://localhost:8080/api/auth/login', {
          username: this.username,
          password: this.password
      }).subscribe({
          next: (user: any) => {
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.router.navigate(['/kanban']);
          },
          error: () => {
              this.errorMessage = 'Invalid username or password!';
          }
      });
  }
}


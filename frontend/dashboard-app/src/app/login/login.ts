import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  http = inject(HttpClient);
  router = inject(Router);

  onLogin(username: string, pass: string) {
    const loginData = { username: username, password: pass };

    this.http.post<any>('http://localhost:3000/api/login', loginData)
      .subscribe({
        next: (response) => {
          if (response.success && response.role === 'admin') {
            
            localStorage.setItem('adminUser', 'true'); 

            alert("Welcome Admin!");
            this.router.navigate(['/dashboard']);
          } else {
            alert("Access Denied: You are not an Admin.");
          }
        },
        error: () => {
          alert("Invalid Username or Password");
        }
      });
  }
}
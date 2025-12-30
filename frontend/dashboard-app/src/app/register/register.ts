import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  http = inject(HttpClient);
  router = inject(Router);

  onRegister(username: string, pass: string, role: string) {
    const userObj = {
      username: username,
      password: pass,
      role: role
    };

    this.http.post<any>('http://localhost:3000/api/register', userObj)
      .subscribe({
        next: (res) => {
          if (res.success) {
            alert("Registration Successful! Please Login.");
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          alert(err.error.message || "Registration Failed");
        }
      });
  }
}
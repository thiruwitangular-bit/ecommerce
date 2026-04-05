import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OTPResponse } from '../model/otpresponse';
import { environment } from '../../environments/environment.development';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<OTPResponse | null>(null);

  sendOTP(phone:string) {
    return this.http.post<OTPResponse>(`${environment.apiURL}/auth/send-otp`, {phone})
  }

  verifyOTP(phone:string,otp:string) {
     return this.http.post<OTPResponse>(`${environment.apiURL}/auth/verify-otp`, {phone,otp}).pipe(
      tap(res=>{
        if (res.token) {
          localStorage.setItem('token',res.token);
          this.currentUser.set(res);

          if (res.role === 'admin') this.router.navigate(['/products'])
            else this.router.navigate(['/'])
        }
      })
     );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken() {
    return localStorage.getItem('token')
  }
}

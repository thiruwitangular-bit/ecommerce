import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OTPResponse } from '../model/otpresponse';
import { environment } from '../../environments/environment.development';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<OTPResponse | null>(null);
  role = signal<string | null>(null)
  
  constructor() {
    this.loadRole();
  }

  loadRole() {
    const token = localStorage.getItem('token');

    if(!token) {
      this.role.set(null);
      return;
    }

    try {
      const decoded:any = jwtDecode(token);
      this.role.set(decoded.role)
    } catch (err){
      this.role.set(null)
    }
  }

  getUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode(token) as any;
    } catch {
      return null;
    }
  }

  isAdmin():boolean {
    const user = this.getUser()
    return user?.role === 'admin';
    console.log('user', this.getUser())
  }


  isLoggedIn() {
return !!this.role()
  }

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
    this.role.set(null)
    this.router.navigate(['/']);
  }

  getToken() {
    return localStorage.getItem('token')
  }
}

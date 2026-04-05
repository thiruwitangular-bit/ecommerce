import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {

  phoneForm!: FormGroup;
  otpForm!: FormGroup;
  otpsent = false;
  error = '';

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router)

  constructor() {
    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required]]
    });

     this.otpForm = this.fb.group({
      otp: ['', [Validators.required]]
    });
  }

  sendOTP() {
    if (this.phoneForm.invalid) return;

    const {phone} = this.phoneForm.value;
    this.auth.sendOTP(phone).subscribe({
      next:()=> (this.otpsent = true),
      error:(err)=> (this.error = err.error?.message || 'failed to send OTP!')
    })
  }

  verifyOTP() {
    if (this.otpForm.invalid) return;
    const {otp} = this.otpForm.value;
    const phone = this.phoneForm.value.phone;

    this.auth.verifyOTP(phone, otp).subscribe({
      next:(res:any)=>{
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.role);

      if (res.role === 'admin') {
        this.router.navigate(['/admin'])
      } else {
        this.router.navigate(['/'])
      }
      },
      error:(err)=> {
        this.error = err.error?.message || 'invalid OTP'
      }
    })
  }
  
}

export interface OTPResponse {
    token?: string;
    role?: 'admin' | 'user';
    phone?: string;
    message: string;
}

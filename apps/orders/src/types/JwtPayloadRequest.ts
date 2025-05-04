export interface JwtPayload {
    sub: string; // or userId: string;
    email: string;
    iat?: number;  // issued at (auto-included by default)
    exp?: number;  // expiry time (auto-included by default)
  }
import { Injectable } from '@angular/core';
import { CryptoService } from '../crypto/crypto-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly EXPIRATION_KEY = 'token_expiration';
  private readonly REFRESH_EXPIRATION_KEY = 'refresh_expiration';

  constructor(private cryptoService: CryptoService) {}

  // Guardar tokens con encriptación
  setTokens(accessToken: string, refreshToken: string, expiresIn: number, refreshExpiresIn: number): void {
    const expirationTime = Date.now() + (expiresIn * 1000);
    const refreshExpirationTime = Date.now() + (refreshExpiresIn * 1000);
    
    // Encriptamos los valores antes de guardarlos
    localStorage.setItem(this.ACCESS_TOKEN_KEY, this.cryptoService.encrypt(accessToken));
    localStorage.setItem(this.REFRESH_TOKEN_KEY, this.cryptoService.encrypt(refreshToken));
    localStorage.setItem(this.EXPIRATION_KEY, this.cryptoService.encrypt(expirationTime.toString()));
    localStorage.setItem(this.REFRESH_EXPIRATION_KEY, this.cryptoService.encrypt(refreshExpirationTime.toString()));
  }

  // Obtener access token
  getAccessToken(): string | null {
    const encryptedToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    return encryptedToken ? this.cryptoService.decrypt(encryptedToken) : null;
  }

  // Obtener refresh token
  getRefreshToken(): string | null {
    const encryptedToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    return encryptedToken ? this.cryptoService.decrypt(encryptedToken) : null;
  }

  // Verificar si el access token ha expirado
  isAccessTokenExpired(): boolean {
    const encryptedExpiration = localStorage.getItem(this.EXPIRATION_KEY);
    if (!encryptedExpiration) return true;
    
    const expirationTime = parseInt(this.cryptoService.decrypt(encryptedExpiration));
    return Date.now() >= expirationTime;
  }

  // Verificar si el refresh token ha expirado
  isRefreshTokenExpired(): boolean {
    const encryptedExpiration = localStorage.getItem(this.REFRESH_EXPIRATION_KEY);
    if (!encryptedExpiration) return true;
    
    try {
      const expirationTime = parseInt(this.cryptoService.decrypt(encryptedExpiration));
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Error checking refresh token expiration:', error);
      return true;
    }
  }

  // Limpiar todos los datos de autenticación
  clearAuthData(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    localStorage.removeItem(this.REFRESH_EXPIRATION_KEY);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !this.isAccessTokenExpired();
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly encryptionKey = '123'; // Cambia esto por una clave segura

  // Encriptar datos
  encrypt(data: string): string {
    // Implementación básica de cifrado - considera usar una librería más segura
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result); // Codificar en base64
  }

  // Desencriptar datos
  decrypt(encryptedData: string): string {
    try {
      const decodedData = atob(encryptedData);
      let result = '';
      for (let i = 0; i < decodedData.length; i++) {
        const charCode = decodedData.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      return '';
    }
  }
}

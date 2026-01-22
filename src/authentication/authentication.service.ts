import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import axios from 'axios';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  private rsaKeyPromise: Promise<CryptoKey> | null = null;

  async signIn(signInDto: SignInDto) {
    try {
      const { username, password } = signInDto;
      const encryptedPassword = await this.encryptPassword(password);

      if (process.env.NODE_ENV !== 'production') {
        this.logger.debug(
          'Skipping actual sign-in in non-production environment',
        );
        return 'dev-token';
      }

      // Example validation

      if (username && encryptedPassword) {
        return 'example-token';
      }
      throw new UnauthorizedException(['Invalid credentials']);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.warn(
          `Sign in failed for user: ${signInDto.username}`,
          error.response?.data,
        );
        if (error.response?.status === 401) {
          throw new UnauthorizedException(['Invalid credentials']);
        }
      }
      this.logger.error('Authentication failed', error);
      throw new UnauthorizedException(['Authentication failed']);
    }
  }

  async importRSAKey() {
    if (this.rsaKeyPromise === null) {
      this.rsaKeyPromise = (async () => {
        try {
          const publicKey = process.env.BASE64_PUBLIC_KEY!;
          if (!publicKey) {
            throw new Error('BASE64_PUBLIC_KEY is not configured');
          }

          const binaryDer = Uint8Array.from(atob(publicKey.trim()), (c) =>
            c.charCodeAt(0),
          );
          return await crypto.subtle.importKey(
            'spki',
            binaryDer.buffer,
            { name: 'RSA-OAEP', hash: 'SHA-256' },
            true,
            ['encrypt'],
          );
        } catch (error) {
          this.rsaKeyPromise = null;
          this.logger.error('Failed to import RSA key', error);
          throw new Error('Failed to import RSA key');
        }
      })();
    }
    return this.rsaKeyPromise;
  }

  async encryptPassword(password: string) {
    const encoder = new TextEncoder();
    const key = await this.importRSAKey();
    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      key,
      encoder.encode(password),
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  }
}

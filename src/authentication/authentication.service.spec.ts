import { Test } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { SignInDto } from './dto/sign-in.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  const mockPublicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...';

  beforeEach(async () => {
    process.env.BASE64_PUBLIC_KEY = mockPublicKey;
    process.env.BIFROST_API_URL = 'http://test-api.com';
    process.env.NODE_ENV = 'production'; // Set to production by default for tests

    const moduleRef = await Test.createTestingModule({
      providers: [AuthenticationService],
    }).compile();

    service = moduleRef.get<AuthenticationService>(AuthenticationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.NODE_ENV; // Clean up
  });

  describe('signIn', () => {
    let mockEncryptedPassword: string;
    const signInDto: SignInDto = {
      username: 'testuser',
      password: 'testpass',
    };

    beforeEach(() => {
      mockEncryptedPassword = 'encrypted_password_base64';
      jest
        .spyOn(service, 'encryptPassword')
        .mockResolvedValue(mockEncryptedPassword);
    });

    const mockSuccessResponse = {
      headers: {
        'set-cookie': [
          'BIFROST_access_token=test.jwt.token; Path=/; HttpOnly',
          'other_cookie=value',
        ],
      },
    };

    it('should return dev-token in non-production environment', async () => {
      process.env.NODE_ENV = 'development';

      const result = await service.signIn(signInDto);

      expect(result).toBe('dev-token');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should successfully sign in and return access token in production', async () => {
      mockedAxios.post.mockResolvedValueOnce(mockSuccessResponse);

      const result = await service.signIn(signInDto);

      expect(result).toBe('test.jwt.token');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://test-api.com/v1/auth/token',
        {
          username: signInDto.username,
          password: mockEncryptedPassword,
        },
        { withCredentials: true },
      );
    });

    it('should throw UnauthorizedException on 401 response', async () => {
      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.post.mockRejectedValueOnce({
        response: { status: 401 },
      });

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException on other axios errors', async () => {
      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.post.mockRejectedValueOnce({
        response: { status: 500 },
      });

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException on non-axios errors', async () => {
      mockedAxios.isAxiosError.mockReturnValue(false);
      mockedAxios.post.mockRejectedValueOnce(new Error('Random error'));

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw error when no cookies in response', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        headers: {},
      });

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw error when cookies is not an array', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        headers: {
          'set-cookie': 'invalid-cookie-format',
        },
      });

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw error when access token cookie is not found', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        headers: {
          'set-cookie': ['other_cookie=value'],
        },
      });

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw error when cookie format is invalid', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        headers: {
          'set-cookie': ['BIFROST_access_token='],
        },
      });

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('importRSAKey', () => {
    const mockCryptoKey = {} as CryptoKey;
    const mockBinaryData = new Uint8Array([1, 2, 3, 4]);

    beforeEach(() => {
      // Mock global atob
      global.atob = jest
        .fn()
        .mockReturnValue(String.fromCharCode(...mockBinaryData));

      // Mock crypto.subtle.importKey
      global.crypto = {
        subtle: {
          importKey: jest.fn().mockResolvedValue(mockCryptoKey),
        },
      } as unknown as Crypto;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should throw error when BASE64_PUBLIC_KEY is not configured', async () => {
      const originalKey = process.env.BASE64_PUBLIC_KEY;
      delete process.env.BASE64_PUBLIC_KEY;

      // Create a new service instance with undefined key
      const moduleRef = await Test.createTestingModule({
        providers: [AuthenticationService],
      }).compile();
      const newService = moduleRef.get<AuthenticationService>(
        AuthenticationService,
      );

      await expect(newService.importRSAKey()).rejects.toThrow(
        'Failed to import RSA key',
      );

      process.env.BASE64_PUBLIC_KEY = originalKey;
    });

    it('should import RSA key successfully', async () => {
      const key = await service.importRSAKey();
      expect(key).toBe(mockCryptoKey);
      expect(global.atob).toHaveBeenCalledWith(mockPublicKey.trim());
      const importKey = crypto.subtle.importKey;
      expect(importKey).toHaveBeenCalledWith(
        'spki',
        mockBinaryData.buffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        true,
        ['encrypt'],
      );
    });

    it('should cache RSA key after first import', async () => {
      const key1 = await service.importRSAKey();
      const key2 = await service.importRSAKey();

      expect(key1).toBe(key2);
      expect(crypto.subtle.importKey).toHaveBeenCalledTimes(1);
    });

    it('should retry import on failure', async () => {
      // Mock importKey to fail once then succeed
      global.crypto.subtle.importKey = jest
        .fn()
        .mockRejectedValueOnce(new Error('Import failed'))
        .mockResolvedValueOnce(mockCryptoKey);

      await expect(service.importRSAKey()).rejects.toThrow(
        'Failed to import RSA key',
      );
      const key = await service.importRSAKey();
      expect(key).toBe(mockCryptoKey);
      expect(crypto.subtle.importKey).toHaveBeenCalledTimes(2);
    });
  });

  describe('encryptPassword', () => {
    const mockCryptoKey = {} as CryptoKey;
    const mockEncryptedBuffer = new Uint8Array([1, 2, 3, 4]);

    beforeEach(() => {
      // Mock crypto.subtle methods
      global.crypto = {
        subtle: {
          importKey: jest.fn().mockResolvedValue(mockCryptoKey),
          encrypt: jest.fn().mockResolvedValue(mockEncryptedBuffer),
        },
      } as unknown as Crypto;
    });

    it('should encrypt password successfully', async () => {
      const password = 'testpassword';
      const encrypted = await service.encryptPassword(password);

      expect(encrypted).toBe(btoa(String.fromCharCode(...mockEncryptedBuffer)));
      expect(crypto.subtle.encrypt).toHaveBeenCalledWith(
        { name: 'RSA-OAEP' },
        mockCryptoKey,
        expect.any(Uint8Array),
      );
    });

    it('should handle encryption errors', async () => {
      global.crypto.subtle.encrypt = jest
        .fn()
        .mockRejectedValue(new Error('Encryption failed'));

      await expect(service.encryptPassword('testpassword')).rejects.toThrow(
        'Encryption failed',
      );
    });
  });
});

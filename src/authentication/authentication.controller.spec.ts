import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

  const mockAuthenticationService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthenticationService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      username: 'test@example.com',
      password: 'password123',
    };

    const mockAccessToken = 'mock.access.token';

    it('should call authenticationService.signIn with correct parameters', async () => {
      mockAuthenticationService.signIn.mockResolvedValue(mockAccessToken);

      await controller.signIn(signInDto);

      expect(mockAuthenticationService.signIn).toHaveBeenCalledWith(signInDto);
      expect(mockAuthenticationService.signIn).toHaveBeenCalledTimes(1);
    });

    it('should return the access token from the service', async () => {
      mockAuthenticationService.signIn.mockResolvedValue(mockAccessToken);

      const result = await controller.signIn(signInDto);

      expect(result).toBe(mockAccessToken);
    });

    it('should throw an error if service.signIn throws', async () => {
      const error = new Error('Authentication failed');
      mockAuthenticationService.signIn.mockRejectedValue(error);

      await expect(controller.signIn(signInDto)).rejects.toThrow(error);
    });
  });

  describe('getUserInfo', () => {
    it('should return the user information from the decorator', () => {
      const mockUser = {
        user_id: 'test-user-123',
        groups: ['Gauss Labs'],
        roles: ['VM Admin'],
      };

      const result = controller.getUserInfo(mockUser);

      expect(result).toBe(mockUser);
      expect(result.user_id).toBe('test-user-123');
      expect(result.groups).toEqual(['Gauss Labs']);
      expect(result.roles).toEqual(['VM Admin']);
    });
  });
});

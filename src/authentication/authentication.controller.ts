import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { BaseController } from 'src/common/controllers/base.controller';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserAuthInfoDto } from './dto/user-auth-info.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserJwtAuthGuard } from './guards/user-jwt-auth.guard';

@Controller('authentication')
export class AuthenticationController extends BaseController {
  constructor(private readonly authenticationService: AuthenticationService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'User sign in' })
  @ApiResponse({
    status: 200,
    description: 'access token',
    type: String,
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authenticationService.signIn(signInDto);
  }

  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('user-info')
  @ApiOperation({ summary: 'Get user information' })
  @ApiResponse({
    status: 200,
    description: 'User information',
    type: UserAuthInfoDto,
  })
  getUserInfo(@CurrentUser() user: UserAuthInfoDto) {
    return user;
  }
}

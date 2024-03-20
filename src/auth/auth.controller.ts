import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('DangNhap')
  login(@Body() loginUser: UserLoginDto) {
    return this.authService.login(loginUser);
  }

  @ApiBody({type: CreateUserDto})
  @Post('DangKy')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
}

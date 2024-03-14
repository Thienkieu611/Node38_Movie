import {
  Controller,
  Get,
  Body,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.getAllUser();
  }

  @Get('role')
  findAll() {
    return this.userService.findAll();
  }

  @Get('view')
  findOne(@Query('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put('update')
  update(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('delete')
  remove(@Query('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('find')
  findUser(@Query('keyword') keyword: string) {
    return this.userService.findUser(keyword);
  }
}

import {
  Controller,
  Get,
  Body,
  Delete,
  Query,
  Put,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @UseGuards(AuthGuard('jwt')) //Dùng để khóa api (muốn khóa api nào thì để trên code api đó)
  @Put('update')
  update(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  remove(@Query('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('search')
  findUser(@Query('keyword') keyword: string) {
    return this.userService.findUser(keyword);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('get-detail')
  getDetail(@Query('id') id: string) {
    return this.userService.getDetail(+id);
  }
}

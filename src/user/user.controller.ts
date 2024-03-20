import {
  Controller,
  Get,
  Body,
  Delete,
  Query,
  Put,
  UseGuards,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('NguoiDung')
@Controller('api/NguoiDung')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('LayDanhSachNguoiDung')
  getAll() {
    return this.userService.getAllUser();
  }

  @Get('LayDanhSachLoaiNguoiDung')
  findAll() {
    return this.userService.findAll();
  }

  @Get('LayNguoiDung')
  findOne(@Query('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt')) //Dùng để khóa api (muốn khóa api nào thì để trên code api đó)
  @Put('CapNhatThongTinNguoiDung')
  update(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('XoaNguoiDung')
  remove(@Query('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('TimKiemNguoiDung')
  findUser(@Query('keyword') keyword: string) {
    return this.userService.findUser(keyword);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('LayThongTinChiTietNguoiDung')
  getDetail(@Query('id') id: string) {
    return this.userService.getDetail(+id);
  }
}

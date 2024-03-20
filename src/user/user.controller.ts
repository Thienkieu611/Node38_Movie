import {
  Controller,
  Get,
  Body,
  Delete,
  Query,
  Put,
  UseGuards,
  Post,
  Headers,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { NguoiDung } from '@prisma/client';

@ApiTags('NguoiDung')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
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
  //Dùng để khóa api (muốn khóa api nào thì để trên code api đó)
  @Put('CapNhatThongTinNguoiDung')
  update(
    @Query('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return this.userService.update(+id, updateUserDto, req);
  }

  @Delete('XoaNguoiDung')
  remove(
    @Query('id') id: string,
    @Req() req: Request,
    @Headers('Authorization') authorizationToken: string,
  ) {
    return this.userService.remove(+id, req);
  }

  @Get('TimKiemNguoiDung')
  findUser(@Query('keyword') keyword: string) {
    return this.userService.findUser(keyword);
  }

  @Get('TimKiemNguoiDungPhanTrang')
  @ApiQuery({
    name: 'soPhanTuTrenTrang',
    required: false,
    type: 'integer',
    example: 10,
  })
  @ApiQuery({
    name: 'soTrang',
    required: false,
    type: 'integer',
    example: 1,
  })
  @ApiQuery({ name: 'tenNguoiDung', required: false, type: 'string' })
  async timKiemNguoiDungPhanTrang(
    @Query('tenNguoiDung') tenNguoiDung: string,
    @Query('soTrang') soTrang: number,
    @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number,
  ): Promise<NguoiDung[]> {
    const skip = (Number(soTrang) - 1) * Number(soPhanTuTrenTrang);

    return await this.userService.timKiemNguoiDungPhanTrang(
      tenNguoiDung,
      Number(skip),
      Number(soPhanTuTrenTrang),
    );
  }

  @Get('LayDanhSachNguoiDungPhanTrang')
  @ApiQuery({
    name: 'soPhanTuTrenTrang',
    required: false,
    type: 'integer',
    example: 10,
  })
  @ApiQuery({
    name: 'soTrang',
    required: false,
    type: 'integer',
    example: 1,
  })
  async layDanhSachNguoiDungPhanTrang(
    @Query('soTrang') soTrang: number,
    @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number,
  ): Promise<NguoiDung[]> {
    const skip = (Number(soTrang) - 1) * Number(soPhanTuTrenTrang);

    return await this.userService.layDanhSachNguoiDungPhanTrang(
      Number(skip),
      Number(soPhanTuTrenTrang),
    );
  }

  @ApiHeader({ name: 'Authorization' })
  @Post('LayThongTinChiTietNguoiDung')
  getDetail(
    @Query('id') id: string,
    @Req() req: Request,
    @Headers('Authorization') authorizationToken: string,
  ) {
    return this.userService.getDetail(+id, req);
  }
}

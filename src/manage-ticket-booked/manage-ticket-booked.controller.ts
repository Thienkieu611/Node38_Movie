import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ManageTicketBookedService } from './manage-ticket-booked.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { AuthGuard } from '@nestjs/passport';

import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { authorize } from 'passport';
import { DanhSachVeDat } from './dto/danh-sach-ve-dat.dto';
import { createResponse, decodedToken } from 'src/utils/config';

@ApiTags('QuanLyDatVe')
@Controller('api/QuanLyDatVe')
export class ManageTicketBookedController {
  constructor(
    private readonly manageTicketBookedService: ManageTicketBookedService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('DatVe')
  async datVe(@Body() datVe: DanhSachVeDat, @Req() req: Request) {
    try {
      const authorizationToken = (req.headers as any).authorization;
      const token = authorizationToken.split('Bearer ')[1];

      const userInfo = await decodedToken(token);
      if (userInfo.role !== 'admin') {
        return createResponse(
          400,
          'Unauthorized',
          'Chỉ có admin mới có thể đặt vé !',
        );
      }
      return await this.manageTicketBookedService.datVe(datVe);
    } catch (error) {
      return createResponse(401, 'Unauthorized', 'Token không hợp lệ');
    }
  }

  @Get('LayDanhSachPhongVe')
  getListRoom(@Query('showtimeId') showtimeId: string) {
    return this.manageTicketBookedService.getListRoom(+showtimeId);
  }

  // @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('TaoLichChieu')
  createShowtime(@Body() createShowtime: CreateShowtimeDto) {
    return this.manageTicketBookedService.createShowtime(createShowtime);
  }
}

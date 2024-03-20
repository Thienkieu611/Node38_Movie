import { Body, Controller, Get, Header, Post, Query, UseGuards } from '@nestjs/common';
import { ManageTicketBookedService } from './manage-ticket-booked.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('QuanLyDatVe')
@Controller('api/QuanLyDatVe')
export class ManageTicketBookedController {
  constructor(
    private readonly manageTicketBookedService: ManageTicketBookedService,
  ) {}

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

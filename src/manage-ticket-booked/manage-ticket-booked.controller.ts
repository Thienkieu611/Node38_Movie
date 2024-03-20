import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ManageTicketBookedService } from './manage-ticket-booked.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { authorize } from 'passport';
import { DanhSachVeDat } from './dto/danh-sach-ve-dat.dto';

@ApiTags('ManageTicketBooked')
@Controller('api/manage-ticket-booked')
export class ManageTicketBookedController {
  constructor(
    private readonly manageTicketBookedService: ManageTicketBookedService,
  ) {}

  @Post('DatVe')
  async datVe(@Body() datVe: DanhSachVeDat) {
    return await this.manageTicketBookedService.datVe(datVe);
  }

  @Get('get-list-ticket-room')
  getListRoom(@Query('showtimeId') showtimeId: string) {
    return this.manageTicketBookedService.getListRoom(+showtimeId);
  }

  // @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create-showtime')
  createShowtime(@Body() createShowtime: CreateShowtimeDto) {
    return this.manageTicketBookedService.createShowtime(createShowtime);
  }
}

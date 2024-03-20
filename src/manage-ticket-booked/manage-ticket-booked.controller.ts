import { Body, Controller, Get, Header, Post, Query, UseGuards } from '@nestjs/common';
import { ManageTicketBookedService } from './manage-ticket-booked.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { authorize } from 'passport';

@ApiTags('ManageTicketBooked')
@Controller('api/manage-ticket-booked')
export class ManageTicketBookedController {
  constructor(
    private readonly manageTicketBookedService: ManageTicketBookedService,
  ) {}

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

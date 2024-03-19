import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Injectable()
export class ManageTicketBookedService {
  prisma = new PrismaClient();

  async getListRoom(showtimeId: number): Promise<any> {
    try {
      const listTicketRoom = await this.prisma.lichChieu.findMany({
        where: {
          ma_lich_chieu: showtimeId,
        },
        include: {
          RapPhim: true,
          Phim: true,
        },
      });
      return listTicketRoom;
    } catch (error) {
      return error;
    }
  }

  async createShowtime(createShowtime: CreateShowtimeDto): Promise<any> {
    try {
      const showtime = await this.prisma.lichChieu.create({
        data: {
          ma_rap: createShowtime.cinemaId,
          ma_phim: createShowtime.movieId,
          ngay_gio_chieu: createShowtime.showTime,
          gia_ve: createShowtime.ticketPrice,
        },
      });
      return showtime;
    } catch (error) {
      return error;
    }
  }
}

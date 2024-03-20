import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { createResponse } from 'src/utils/config';
import { DanhSachVeDat } from './dto/danh-sach-ve-dat.dto';

@Injectable()
export class ManageTicketBookedService {
  prisma = new PrismaClient();

  async datVe(datVe: DanhSachVeDat): Promise<any> {
    const { maLichChieu, danhSachVe } = datVe;
    try {
      // const lichChieu = await this.prisma.lichChieu.findUnique({
      //   where: { ma_lich_chieu: maLichChieu },
      // });
      // if (!lichChieu) {
      //   throw new Error('Không tìm thấy lịch chiếu');
      // }
      // const promises = danhSachVe.map(async (ve) => {
      //   const { maGhe, giaVe } = ve;
      //   await this.prisma.datVe.create({
      //     data: {
      //       ma_lich_chieu: maLichChieu,
      //       ma_ghe: maGhe,
      //       gia,
      //     },
      //   });
      // });
    } catch (error) {}
  }

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
      const payload = createResponse(200, 'Xử lý thành công', listTicketRoom);
      return payload;
    } catch (error) {
      const errorPayload = createResponse(
        500,
        'Đã xảy ra lỗi khi xử lý yêu cầu',
        error,
      );
      return errorPayload;
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
      const payload = createResponse(200, 'Xử lý thành công', showtime);
      return payload;
    } catch (error) {
      const errorPayload = createResponse(
        500,
        'Đã xảy ra lỗi khi xử lý yêu cầu',
        error,
      );
      return errorPayload;
    }
  }
}

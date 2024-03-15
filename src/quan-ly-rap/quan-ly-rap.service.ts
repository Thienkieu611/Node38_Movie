import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuanLyRapDto } from './dto/create-quan-ly-rap.dto';
import { UpdateQuanLyRapDto } from './dto/update-quan-ly-rap.dto';
import { CumRap, HeThongRap, PrismaClient } from '@prisma/client';
import { createResponse } from 'src/utils/config';
import { contains } from 'class-validator';
@Injectable()
export class QuanLyRapService {
  prisma = new PrismaClient();
  async layThongTinHeThongRap(maHeThongRap?: number): Promise<any> {
    try {
      let whereCondition: any = {};
      if (maHeThongRap !== undefined) {
        whereCondition = { ma_he_thong_rap: maHeThongRap };
      }

      const danhSachHeThongRap = await this.prisma.heThongRap.findMany({
        where: whereCondition,
      });
      const payload = createResponse(
        200,
        'Xử lý thành công',
        danhSachHeThongRap,
      );

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
  async LayThongTinCumRapTheoHeThong(maHeThongRap: number): Promise<any> {
    try {
      const checkMaHeThong = await this.prisma.heThongRap.findFirst({
        where: {
          ma_he_thong_rap: maHeThongRap,
        },
      });
      if (!checkMaHeThong) {
        return createResponse(
          400,
          'Không tìm thấy tài nguyên',
          'Mã hệ thống không tồn tại',
        );
      }
      const cumRap = await this.prisma.cumRap.findMany({
        where: { ma_he_thong_rap: maHeThongRap },
        include: {
          RapPhim: true,
        },
      });

      if (!cumRap) {
        throw new NotFoundException('Không tìm thấy hệ thống rạp');
      }

      const thongTinCumRap = cumRap.map((rap) => ({
        maCumRap: rap.ma_cum_rap,
        tenCumRap: rap.ten_cum_rap,
        diaChi: rap.dia_chi,
        danhSachRap: rap.RapPhim.map((rap) => ({
          maRap: rap.ma_rap,
          tenRap: rap.ten_rap,
        })),
      }));
      const payload = createResponse(200, 'Xử lý thành công', thongTinCumRap);

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
  async LayThongTinLichChieuHeThongRap(maHeThongRap: number): Promise<any> {
    try {
      let condition: any = {};
      if (maHeThongRap !== undefined) {
        condition = { ma_he_thong_rap: maHeThongRap };
      }

      const cumRapData = await this.prisma.cumRap.findMany({
        where: condition,
        include: {
          RapPhim: {
            include: {
              LichChieu: true,
            },
          },
        },
      });
      const content = cumRapData.map((cumRap) => ({
        lstCumRap: cumRap.RapPhim.map((phim) => ({
          danhSachPhim: phim.LichChieu.map((lichChieu) => ({
            maLichChieu: lichChieu.ma_lich_chieu,
            maRap: lichChieu.ma_rap,

            ngayChieuGioChieu: lichChieu.ngay_gio_chieu,
            giaVe: lichChieu.gia_ve,
          })),
        })),
      }));
      const payload = createResponse(200, 'Xử lý thành công', content);
      return payload;
    } catch (error) {}
  }
  layThongTinLichChieuPhim() {
    return `This action returns all quanLyRap`;
  }
}

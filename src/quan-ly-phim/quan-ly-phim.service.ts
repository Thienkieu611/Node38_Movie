import { Injectable } from '@nestjs/common';
import { CreateQuanLyPhimDto } from './dto/create-quan-ly-phim.dto';
import { UpdateQuanLyPhimDto } from './dto/update-quan-ly-phim.dto';
import { Banner, Phim, PrismaClient } from '@prisma/client';
import { createResponse } from 'src/utils/config';
import { SearchFilmDto } from './dto/search-phim.dto';
import { contains } from 'class-validator';

@Injectable()
export class QuanLyPhimService {
  prisma = new PrismaClient();
  async layDanhSachBanner(): Promise<Banner[]> {
    try {
      const banners = await this.prisma.banner.findMany();
      const payload = createResponse(200, 'Xử lý thành công', banners);
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

  async layDanhSachPhim(searchParams: SearchFilmDto): Promise<Phim[]> {
    try {
      const { tenPhim } = searchParams;

      const tenPhimLowerCase = tenPhim ? tenPhim.toLowerCase() : '';

      const danhSachPhim = await this.prisma.phim.findMany({
        where: {
          ten_phim: {
            contains: tenPhimLowerCase,
          },
        },
      });
      const payload = createResponse(200, 'Xử lý thành công', danhSachPhim);
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

  async layDanhSachPhimPhanTrang(
    tenPhim: string,
    skip: number,
    soPhanTuTrenTrang: number,
  ): Promise<Phim[]> {
    try {
      const tenPhimLowerCase = tenPhim ? tenPhim.toLowerCase() : '';

      const danhSachPhim = await this.prisma.phim.findMany({
        where: {
          ten_phim: {
            contains: tenPhimLowerCase,
          },
        },
        skip,
        take: soPhanTuTrenTrang,
      });

      const payload = createResponse(200, 'Xử lý thành công', danhSachPhim);

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

  async layDanhSachPhimTheoNgay(searchParams: SearchFilmDto): Promise<Phim[]> {
    try {
      const { soTrang, soPhanTuTrenTrang, tenPhim, tuNgay, denNgay } =
        searchParams;
      const skip = (soTrang - 1) * soPhanTuTrenTrang;

      const phim = tenPhim.toLowerCase();

      const danhSachPhim = await this.prisma.phim.findMany({
        where: {
          ten_phim: {
            contains: phim,
          },
        },
        skip: skip,
        take: soPhanTuTrenTrang,
      });

      const payload = createResponse(200, 'Xử lý thành công', danhSachPhim);

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

  async layThongTinPhim(searchParams: SearchFilmDto): Promise<Phim | null> {
    try {
      const { maPhim } = searchParams;
      const thongTinPhim = await this.prisma.phim.findFirst({
        where: { ma_phim: maPhim },
      });

      //const payload = createResponse(200, 'Xử lý thành công', thongTinPhim);
      return thongTinPhim;
    } catch (error) {}
  }
}

import { Injectable } from '@nestjs/common';
import { CreateQuanLyPhimDto } from './dto/create-quan-ly-phim.dto';

import { Banner, Phim, PrismaClient } from '@prisma/client';
import { createResponse } from 'src/utils/config';
import { SearchFilmDto } from './dto/search-phim.dto';

import { UpdatePhimDto } from './dto/update-phim.dto';

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

  async layDanhSachPhimTheoNgay(
    tenPhim: string,
    skip: number,
    soPhanTuTrenTrang: number,
    tuNgay: string,
    denNgay: string,
  ): Promise<Phim[]> {
    try {
      const tenPhimLowerCase = tenPhim ? tenPhim.toLowerCase() : '';

      const danhSachPhim = await this.prisma.phim.findMany({
        where: {
          AND: [
            {
              ten_phim: {
                contains: tenPhimLowerCase,
              },
            },
            tuNgay ? { ngay_khoi_chieu: { gte: new Date(tuNgay) } } : {},
            denNgay ? { ngay_khoi_chieu: { lte: new Date(denNgay) } } : {},
          ],
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

  async quanLyPhim(file: Express.Multer.File, tenPhim: string): Promise<any> {
    try {
      if (file.size > 1 * 1024 * 1024) {
        return 'Dung lượng file không được vượt quá 1MB';
      }
      const allowedImageFormats = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
      ];
      if (!allowedImageFormats.includes(file.mimetype)) {
        return 'File không phải là ảnh';
      }

      const createQuanLyPhimDto: CreateQuanLyPhimDto = {
        ten_phim: tenPhim,
        hinh_anh: file.path,
      };

      const createPhim = await this.prisma.phim.create({
        data: createQuanLyPhimDto,
      });

      const payload = createResponse(201, 'Tạo phim thành công', createPhim);
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

  async capNhatPhimUpload(maPhim: number, updatePhimDto: UpdatePhimDto) {
    try {
      const checkMaPhim = await this.prisma.phim.findFirst({
        where: {
          ma_phim: maPhim,
        },
      });
      if (!checkMaPhim) {
        return createResponse(
          400,
          'Không tìm thấy tài nguyên',
          'Mã phim không tồn tại',
        );
      }
      const updatePhim = await this.prisma.phim.update({
        where: {
          ma_phim: maPhim,
        },
        data: {
          ten_phim: updatePhimDto.ten_phim,
          trailer: updatePhimDto.trailer,
          hinh_anh: updatePhimDto.hinh_anh,
          mo_ta: updatePhimDto.mo_ta,
          ngay_khoi_chieu: updatePhimDto.ngay_khoi_chieu,
          danh_gia: updatePhimDto.danh_gia,
          hot: updatePhimDto.hot,
          dang_chieu: updatePhimDto.dang_chieu,
          sap_chieu: updatePhimDto.sap_chieu,
        },
      });
      const payload = createResponse(200, 'Xử lý thành công', updatePhim);
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
  async xoaPhim(maPhim: number): Promise<any> {
    const checkMaPhim = await this.prisma.phim.findFirst({
      where: {
        ma_phim: maPhim,
      },
    });
    if (!checkMaPhim) {
      return createResponse(
        400,
        'Không tìm thấy tài nguyên',
        'Mã phim không tồn tại',
      );
    }
    await this.prisma.phim.delete({
      where: {
        ma_phim: maPhim,
      },
    });
    const payload = createResponse(200, 'Xử lý thành công', 'Phim đã được xoá');
    return payload;
  }

  async layThongTinPhim(maPhim: number): Promise<Phim | null> {
    try {
      const thongTinPhim = await this.prisma.phim.findFirst({
        where: { ma_phim: maPhim },
      });
      if (!thongTinPhim) {
        return createResponse(
          400,
          'Không tìm thấy tài nguyên',
          'Mã phim không tồn tại',
        );
      }
      const payload = createResponse(200, 'Xử lý thành công', thongTinPhim);
      return payload;
    } catch (error) {}
  }
}

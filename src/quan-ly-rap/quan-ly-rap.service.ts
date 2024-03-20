import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createResponse } from 'src/utils/config';

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
  async LayThongTinLichChieuHeThongRap(
    maHeThongRap: number | undefined,
  ): Promise<any> {
    try {
      let condition: any = {};
      if (maHeThongRap !== undefined) {
        condition = { ma_he_thong_rap: maHeThongRap };
      }

      const heThongRapData = await this.prisma.heThongRap.findMany({
        where: condition,
        include: {
          CumRap: {
            include: {
              RapPhim: {
                include: {
                  LichChieu: {
                    include: {
                      Phim: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const content = heThongRapData.map((heThong) => ({
        lstCumRap: heThong.CumRap.map((cumRap) => ({
          danhSachPhim: cumRap.RapPhim.map((rap) => ({
            lstLichChieuTheoPhim: rap.LichChieu.map((lichChieu) => ({
              maLichChieu: lichChieu.ma_lich_chieu,
              maRap: lichChieu.ma_rap,
              tenRap: rap.ten_rap,
              ngayChieuGioChieu: lichChieu.ngay_gio_chieu,
              giaVe: lichChieu.gia_ve,
            })),
            maPhim: rap.LichChieu[0].Phim.ma_phim,
            tenPhim: rap.LichChieu[0].Phim.ten_phim,
            hinhAnh: rap.LichChieu[0].Phim.hinh_anh,
            hot: rap.LichChieu[0].Phim.hot,
            dangChieu: rap.LichChieu[0].Phim.dang_chieu,
            sapChieu: rap.LichChieu[0].Phim.sap_chieu,
            danhGia: rap.LichChieu[0].Phim.danh_gia,
          })),
          maCumRap: cumRap.ma_cum_rap,
          tenCumRap: cumRap.ten_cum_rap,
          diaChi: cumRap.dia_chi,
        })),
        maHeThongRap: heThong.ma_he_thong_rap,
        tenHeThong: heThong.ten_he_thong_rap,
        logo: heThong.logo,
      }));

      const payload = createResponse(200, 'Xử lý thành công', content);
      return payload;
    } catch (error) {}
  }
  async layThongTinLichChieuPhim(maPhim: number): Promise<any> {
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

      const thongTinLichChieu = await this.prisma.phim.findUnique({
        where: {
          ma_phim: maPhim,
        },
        include: {
          LichChieu: {
            include: {
              RapPhim: {
                include: {
                  CumRap: {
                    include: {
                      HeThongRap: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const lichChieuGomNhom = {};
      thongTinLichChieu.LichChieu.forEach((lichChieu) => {
        const maCumRap = lichChieu.RapPhim.CumRap.ma_cum_rap;
        if (!lichChieuGomNhom[maCumRap]) {
          lichChieuGomNhom[maCumRap] = [];
        }
        lichChieuGomNhom[maCumRap].push({
          maLichChieu: lichChieu.ma_lich_chieu,
          maRap: lichChieu.RapPhim.ma_rap,
          tenRap: lichChieu.RapPhim.ten_rap,
          ngayChieuGioChieu: lichChieu.ngay_gio_chieu,
          giaVe: lichChieu.gia_ve,
        });
      });

      // Ghép các lịch chiếu có cùng maCumRap vào với nhau
      const heThongRapChieu = Object.keys(lichChieuGomNhom).map((maCumRap) => ({
        cumRapChieu: [
          {
            lichChieuPhim: lichChieuGomNhom[maCumRap],
            maCumRap: parseInt(maCumRap),
            tenCumRap: thongTinLichChieu.LichChieu.find(
              (lichChieu) =>
                lichChieu.RapPhim.CumRap.ma_cum_rap === parseInt(maCumRap),
            ).RapPhim.CumRap.ten_cum_rap,
            diaChi: thongTinLichChieu.LichChieu.find(
              (lichChieu) =>
                lichChieu.RapPhim.CumRap.ma_cum_rap === parseInt(maCumRap),
            ).RapPhim.CumRap.dia_chi,
          },
        ],
        maHeThong: thongTinLichChieu.LichChieu.find(
          (lichChieu) =>
            lichChieu.RapPhim.CumRap.ma_cum_rap === parseInt(maCumRap),
        ).RapPhim.CumRap.HeThongRap.ma_he_thong_rap,
        tenHeThong: thongTinLichChieu.LichChieu.find(
          (lichChieu) =>
            lichChieu.RapPhim.CumRap.ma_cum_rap === parseInt(maCumRap),
        ).RapPhim.CumRap.HeThongRap.ten_he_thong_rap,
        logo: thongTinLichChieu.LichChieu.find(
          (lichChieu) =>
            lichChieu.RapPhim.CumRap.ma_cum_rap === parseInt(maCumRap),
        ).RapPhim.CumRap.HeThongRap.logo,
      }));

      const content = {
        heThongRapChieu: heThongRapChieu,
        maPhim: thongTinLichChieu.ma_phim,
        tenPhim: thongTinLichChieu.ten_phim,
        trailer: thongTinLichChieu.trailer,
        hinhAnh: thongTinLichChieu.hinh_anh,
        moTa: thongTinLichChieu.mo_ta,
        hot: thongTinLichChieu.hot,
        dangChieu: thongTinLichChieu.dang_chieu,
        sapChieu: thongTinLichChieu.sap_chieu,
        ngayKhoiChieu: thongTinLichChieu.ngay_khoi_chieu,
        danhGia: thongTinLichChieu.danh_gia,
      };

      const payload = createResponse(200, 'Xử lý thành công', content);

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

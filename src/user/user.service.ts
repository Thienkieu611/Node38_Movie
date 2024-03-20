import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { NguoiDung, PrismaClient } from '@prisma/client';
import { createResponse, decodedToken } from 'src/utils/config';

@Injectable()
export class UserService {
  prisma = new PrismaClient();

  findAll() {
    try {
      const data = [
        {
          maLoaiNguoiDung: 'admin',
          tenLoai: 'admin',
        },
        {
          maLoaiNguoiDung: 'users',
          tenLoai: 'users',
        },
      ];
      const payload = createResponse(200, 'Xử lý thành công', data);
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

  async findOne(id: number): Promise<NguoiDung> {
    try {
      const user = await this.prisma.nguoiDung.findUnique({
        where: {
          tai_khoan: id,
        },
      });
      const payload = createResponse(200, 'Xử lý thành công', user);
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

  async update(id: number, updateUserDto: UpdateUserDto, req: any) {
    try {
      const checkEmail = await this.prisma.nguoiDung.findFirst({
        where: {
          email: updateUserDto.email,
        },
      });
      if (checkEmail) {
        return 'Email is exist';
      } else {
        const createUser = await this.prisma.nguoiDung.update({
          where: {
            tai_khoan: id,
          },
          data: {
            email: updateUserDto.email,
            mat_khau: updateUserDto.password,
            ho_ten: updateUserDto.name,
            loai_nguoi_dung: updateUserDto.role,
            so_dt: updateUserDto.phone,
          },
        });
        const payload = createResponse(200, 'Xử lý thành công', createUser);
        return payload;
      }
    } catch (error) {
      const errorPayload = createResponse(
        500,
        'Đã xảy ra lỗi khi xử lý yêu cầu',
        error,
      );
      return errorPayload;
    }
  }

  async remove(id: number, req: any): Promise<any> {
    try {
      const deleteUser = await this.prisma.nguoiDung.delete({
        where: {
          tai_khoan: id,
        },
      });
      const dataToken = req.user;
      if (dataToken.role == 'admin') {
        const payload = createResponse(200, 'Xử lý thành công', deleteUser);
        return payload;
      } else {
        const payload = createResponse(403, 'Không có quyền truy cập', null);
        return payload;
      }
    } catch (error) {
      const errorPayload = createResponse(
        500,
        'Đã xảy ra lỗi khi xử lý yêu cầu',
        error,
      );
      return errorPayload;
    }
  }

  async getAllUser(): Promise<any> {
    try {
      const user = await this.prisma.nguoiDung.findMany();
      const payload = createResponse(200, 'Xử lý thành công', user);
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

  async findUser(keyword: string) {
    try {
      const user = await this.prisma.nguoiDung.findMany({
        where: {
          ho_ten: {
            contains: keyword,
          },
        },
      });
      const payload = createResponse(200, 'Xử lý thành công', user);
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

  async getDetail(id: number, req: any): Promise<any> {
    try {
      const user = await this.prisma.nguoiDung.findUnique({
        where: {
          tai_khoan: id,
        },
      });
      const dataToken = req.user;
      if (dataToken.id == user.tai_khoan) {
        const payload = createResponse(200, 'Xử lý thành công', user);
        return payload;
      } else {
        const payload = createResponse(403, 'Không có quyền truy cập', null);
        return payload;
      }
    } catch (error) {
      const errorPayload = createResponse(
        500,
        'Đã xảy ra lỗi khi xử lý yêu cầu',
        error,
      );
      return errorPayload;
    }
  }

  async timKiemNguoiDungPhanTrang(
    tenNguoiDung: string,
    skip: number,
    soPhanTuTrenTrang: number,
  ): Promise<NguoiDung[]> {
    try {
      const tenNguoiDungLowerCase = tenNguoiDung
        ? tenNguoiDung.toLowerCase()
        : '';

      const danhSachNguoiDung = await this.prisma.nguoiDung.findMany({
        where: {
          ho_ten: {
            contains: tenNguoiDungLowerCase,
          },
        },
        skip,
        take: soPhanTuTrenTrang,
      });

      const payload = createResponse(
        200,
        'Xử lý thành công',
        danhSachNguoiDung,
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

  async layDanhSachNguoiDungPhanTrang(
    skip: number,
    soPhanTuTrenTrang: number,
  ): Promise<NguoiDung[]> {
    try {
      const danhSachNguoiDung = await this.prisma.nguoiDung.findMany({
        skip,
        take: soPhanTuTrenTrang,
      });

      const payload = createResponse(
        200,
        'Xử lý thành công',
        danhSachNguoiDung,
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
}

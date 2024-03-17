import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { NguoiDung, PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {
  prisma = new PrismaClient();

  findAll() {
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
    return data;
  }

  async findOne(id: number): Promise<NguoiDung> {
    const user = await this.prisma.nguoiDung.findUnique({
      where: {
        tai_khoan: id,
      },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const upadateUser = await this.prisma.nguoiDung.update({
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
    return upadateUser;
  }

  async remove(id: number): Promise<any> {
    try {
      const deleteUser = await this.prisma.nguoiDung.delete({
        where: {
          tai_khoan: id,
        },
      });
      return deleteUser;
    } catch (error) {
      return error;
    }
  }

  async getAllUser(): Promise<any> {
    try {
      const user = await this.prisma.nguoiDung.findMany();
      return user;
    } catch (error) {
      return error;
    }
  }

  async findUser(keyword: string) {
    const user = await this.prisma.nguoiDung.findMany({
      where: {
        ho_ten: {
          contains: keyword,
        },
      },
    });
    return user;
  }

  async getDetail(id:number): Promise<NguoiDung> {
    
    const user = await this.prisma.nguoiDung.findUnique({
      where: {
        tai_khoan: id,
      },
    });
    return user;
  }
}

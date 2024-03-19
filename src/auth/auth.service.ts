import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserLogin } from 'src/user/entities/user.entity';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  prisma = new PrismaClient();

  async login(loginUser: UserLogin) {
    try {
      const user = await this.prisma.nguoiDung.findFirst({
        where: {
          email: loginUser.email,
        },
      });
      if (user) {
        const data = {
          id: user.tai_khoan,
          email: user.email,
          name: user.ho_ten,
          phone: user.so_dt,
          role: user.loai_nguoi_dung,
        };
        // token jwt, dùng khi tạo mã hóa jwt
        let token = this.jwtService.signAsync(
          data ,
          { expiresIn: "10m", secret: 'SECRET_KEY' },
        );
        const saltOrRounds = 10;
        const password = loginUser.password;
        const hash = await bcrypt.hash(password, saltOrRounds);
        const checkPassword = bcrypt.compareSync(user.mat_khau, hash);
        if (checkPassword) {
          return token;
        } else {
          return 'Email or Password is incorrect!';
        }
      } else {
        return 'Email or Password is incorrect!';
      }
    } catch (error) {
      return error;
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const checkEmail = await this.prisma.nguoiDung.findFirst({
        where: {
          email: createUserDto.email,
        },
      });
      if (checkEmail) {
        return 'Email is exist';
      } else {
        const createUser = await this.prisma.nguoiDung.create({
          data: {
            email: createUserDto.email,
            mat_khau: createUserDto.password,
            ho_ten: createUserDto.name,
            loai_nguoi_dung: createUserDto.role,
            so_dt: createUserDto.phone,
          },
        });
        return createUser;
      }
    } catch (error) {
      return error;
    }
  }
}

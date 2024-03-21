import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { QuanLyPhimService } from './quan-ly-phim.service';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Banner, Phim } from '@prisma/client';
import { SearchFilmDto } from './dto/search-phim.dto';
import { createResponse, decodedToken } from 'src/utils/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePhimDto } from './dto/update-phim.dto';

@ApiTags('QuanLyPhim')
@Controller('api/QuanLyPhim')
export class QuanLyPhimController {
  constructor(private readonly quanLyPhimService: QuanLyPhimService) {}

  @Get('LayDanhSachBanner')
  async layDanhSachBanner(): Promise<Banner[]> {
    return await this.quanLyPhimService.layDanhSachBanner();
  }
  @Get('LayDanhSachPhim')
  @ApiQuery({ name: 'tenPhim', required: false, type: 'string' })
  async layDanhSachPhim(@Query() searchParams: SearchFilmDto): Promise<Phim[]> {
    return await this.quanLyPhimService.layDanhSachPhim(searchParams);
  }

  @Get('LayDanhSachPhimPhanTrang')
  @ApiQuery({
    name: 'soPhanTuTrenTrang',
    required: false,
    type: 'integer',
    example: 10,
  })
  @ApiQuery({
    name: 'soTrang',
    required: false,
    type: 'integer',
    example: 1,
  })
  @ApiQuery({ name: 'tenPhim', required: false, type: 'string' })
  async layDanhSachPhimPhanTrang(
    @Query('tenPhim') tenPhim: string,
    @Query('soTrang') soTrang: number,
    @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number,
  ): Promise<Phim[]> {
    const skip = (Number(soTrang) - 1) * Number(soPhanTuTrenTrang);

    return await this.quanLyPhimService.layDanhSachPhimPhanTrang(
      tenPhim,
      Number(skip),
      Number(soPhanTuTrenTrang),
    );
  }

  @Get('LayDanhSachPhimTheoNgay')
  @ApiQuery({
    name: 'denNgay',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'tuNgay',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'soPhanTuTrenTrang',
    required: false,
    type: 'integer',
    example: 10,
  })
  @ApiQuery({
    name: 'soTrang',
    required: false,
    type: 'integer',
    example: 1,
  })
  @ApiQuery({ name: 'tenPhim', required: false, type: 'string' })
  async layDanhSachPhimTheoNgay(
    @Query('tenPhim') tenPhim: string,
    @Query('soTrang') soTrang: number,
    @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number,
    @Query('tuNgay') tuNgay: string,
    @Query('denNgay') denNgay: string,
  ): Promise<Phim[]> {
    const skip = (Number(soTrang) - 1) * Number(soPhanTuTrenTrang);

    // Kiểm tra tính hợp lệ của tuNgay và denNgay
    const isValidDate = (dateString: string): boolean => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return regex.test(dateString);
    };

    if (
      (tuNgay && !isValidDate(tuNgay)) ||
      (denNgay && !isValidDate(denNgay))
    ) {
      return createResponse(400, 'Yêu cầu không hợp lệ!', 'Ngày không hợp lệ ');
    }

    return await this.quanLyPhimService.layDanhSachPhimTheoNgay(
      tenPhim,
      Number(skip),
      Number(soPhanTuTrenTrang),
      tuNgay,
      denNgay,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('QuanLyPhim')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          callback(null, new Date().getTime() + `${file.originalname}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dữ liệu của file',
    required: true,
    schema: {
      type: 'object',

      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
        tenPhim: {
          type: 'string',
          description: 'Tên phim',
        },
      },
    },
  })
  async quanLyPhim(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
    @Body('tenPhim') tenPhim: string,
  ): Promise<any> {
    const authorizationToken = (req.headers as any).authorization;
    const token = authorizationToken.split('Bearer ')[1];
    const userInfo = await decodedToken(token);
    if (userInfo.role !== 'admin') {
      return createResponse(
        400,
        'Unauthorized',
        'Chỉ có admin mới có thể quản lý phim !',
      );
    }
    return await this.quanLyPhimService.quanLyPhim(file, tenPhim);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('CapNhatPhimUpload')
  async capNhatPhimUpload(
    @Req() req: Request,
    @Query('maPhim') maPhim: number,
    @Body() updatePhimDto: UpdatePhimDto,
  ) {
    const authorizationToken = (req.headers as any).authorization;
    const token = authorizationToken.split('Bearer ')[1];
    const userInfo = await decodedToken(token);
    if (userInfo.role !== 'admin') {
      return createResponse(
        400,
        'Unauthorized',
        'Chỉ có admin mới có thể update !',
      );
    }
    return await this.quanLyPhimService.capNhatPhimUpload(
      +maPhim,
      updatePhimDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('XoaPhim')
  @ApiQuery({ name: 'maPhim', type: 'number' })
  async xoaPhim(
    @Query('maPhim') maPhim: number,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const authorizationToken = (req.headers as any).authorization;
      const token = authorizationToken.split('Bearer ')[1];

      const userInfo = await decodedToken(token);
      if (userInfo.role !== 'admin') {
        return createResponse(
          400,
          'Unauthorized',
          'Chỉ có admin mới có thể xoá !',
        );
      }

      return await this.quanLyPhimService.xoaPhim(Number(maPhim));
    } catch (error) {
      return createResponse(401, 'Unauthorized', 'Token không hợp lệ');
    }
  }

  @Get('LayThongTinPhim')
  @ApiQuery({ name: 'maPhim', type: 'number' })
  async layThongTinPhim(@Query('maPhim') maPhim: number): Promise<Phim | null> {
    return await this.quanLyPhimService.layThongTinPhim(Number(maPhim));
  }
}

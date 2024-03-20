import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { QuanLyPhimService } from './quan-ly-phim.service';
import { CreateQuanLyPhimDto } from './dto/create-quan-ly-phim.dto';
import { UpdateQuanLyPhimDto } from './dto/update-quan-ly-phim.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Banner, Phim } from '@prisma/client';
import { SearchFilmDto } from './dto/search-phim.dto';
import { createResponse } from 'src/utils/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
    @UploadedFile('file') file: Express.Multer.File,
    @Body('tenPhim') tenPhim: string,
  ): Promise<any> {
    return await this.quanLyPhimService.quanLyPhim(file, tenPhim);
  }

  @Post('ThemPhimUploadHinh')
  async themPhimUploadHinh() {
    return await this.quanLyPhimService.themPhimUploadHinh();
  }
  @Post('CapNhatPhimUpload')
  async capNhatPhimUpload() {
    return await this.quanLyPhimService.capNhatPhimUpload();
  }

  @Delete('XoaPhim')
  @ApiQuery({ name: 'maPhim', type: 'number' })
  async xoaPhim(
    @Query('maPhim') maPhim: number,
    // @Headers('Authorization') authorizationToken: string,
  ): Promise<any> {
    // if (!authorizationToken) {
    //   return createResponse(401, 'Unauthorized', 'Bạn không có quyền truy cập');
    // }
    return await this.quanLyPhimService.xoaPhim(Number(maPhim));
  }

  @Get('LayThongTinPhim')
  @ApiQuery({ name: 'maPhim', type: 'number' })
  async layThongTinPhim(@Query('maPhim') maPhim: number): Promise<Phim | null> {
    return await this.quanLyPhimService.layThongTinPhim(Number(maPhim));
  }
}

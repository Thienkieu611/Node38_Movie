import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuanLyPhimService } from './quan-ly-phim.service';
import { CreateQuanLyPhimDto } from './dto/create-quan-ly-phim.dto';
import { UpdateQuanLyPhimDto } from './dto/update-quan-ly-phim.dto';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Banner, Phim } from '@prisma/client';
import { SearchFilmDto } from './dto/search-phim.dto';
import { createResponse } from 'src/utils/config';

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

  @Get('LayThongTinPhim')
  @ApiQuery({ name: 'maPhim', type: 'number' })
  async layThongTinPhim(@Query('maPhim') maPhim: number): Promise<Phim | null> {
    return await this.quanLyPhimService.layThongTinPhim(Number(maPhim));
  }
}

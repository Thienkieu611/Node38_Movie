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
  @ApiParam({
    name: 'soPhanTuTrenTrang',
    required: false,
    type: 'integer',
  })
  @ApiParam({
    name: 'soTrang',
    required: false,
    type: 'integer',
  })
  @ApiQuery({ name: 'tenPhim', required: false, type: 'string' })
  async layDanhSachPhimPhanTrang(
    @Query() searchParams: SearchFilmDto,
  ): Promise<Phim[]> {
    const { soTrang, tenPhim, soPhanTuTrenTrang } = searchParams;
    const skip = (soTrang - 1) * soPhanTuTrenTrang;
    return await this.quanLyPhimService.layDanhSachPhimPhanTrang(
      tenPhim,
      skip,
      soPhanTuTrenTrang,
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
    @Query() searchParams: SearchFilmDto,
  ): Promise<Phim[]> {
    return await this.quanLyPhimService.layDanhSachPhimTheoNgay(searchParams);
  }

  @Get('LayThongTinPhim')
  @ApiQuery({ name: 'maPhim', type: 'number' })
  async layThongTinPhim(
    @Query() searchParams: SearchFilmDto,
  ): Promise<Phim | null> {
    return await this.quanLyPhimService.layThongTinPhim(searchParams);
  }
}

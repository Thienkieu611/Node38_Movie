import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { QuanLyRapService } from './quan-ly-rap.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { HeThongRap } from '@prisma/client';

@ApiTags('QuanLyRap')
@Controller('api/QuanLyRap')
export class QuanLyRapController {
  constructor(private readonly quanLyRapService: QuanLyRapService) {}

  @Get('LayThongTinHeThongRap')
  @ApiQuery({ name: 'maHeThongRap', required: false, type: 'number' })
  async layThongTinHeThongRap(
    @Query('maHeThongRap') maHeThongRap: string,
  ): Promise<HeThongRap[]> {
    let parsedMaHeThongRap: number | undefined;

    if (maHeThongRap !== undefined && maHeThongRap.trim() !== '') {
      parsedMaHeThongRap = parseInt(maHeThongRap, 10);
      if (isNaN(parsedMaHeThongRap)) {
        throw new BadRequestException('MaHeThongRap must be a number');
      }
    }

    return await this.quanLyRapService.layThongTinHeThongRap(
      parsedMaHeThongRap,
    );
  }

  @Get('LayThongTinCumRapTheoHeThong')
  @ApiQuery({ name: 'maHeThongRap', required: true, type: 'number' })
  async LayThongTinCumRapTheoHeThong(
    @Query('maHeThongRap') maHeThongRap: string,
  ): Promise<any> {
    let parsedMaHeThongRap: number | undefined;

    if (maHeThongRap !== undefined && maHeThongRap.trim() !== '') {
      parsedMaHeThongRap = parseInt(maHeThongRap, 10);
      if (isNaN(parsedMaHeThongRap)) {
        throw new BadRequestException('MaHeThongRap must be a number');
      }
    }

    return await this.quanLyRapService.LayThongTinCumRapTheoHeThong(
      parsedMaHeThongRap,
    );
  }
  @Get('LayThongTinLichChieuHeThongRap')
  @ApiQuery({ name: 'maHeThongRap', required: false, type: 'number' })
  async layThongTinLichChieuHeThongRap(
    @Query('maHeThongRap') maHeThongRap: string,
  ): Promise<any> {
    let parsedMaHeThongRap: number | undefined;

    if (maHeThongRap !== undefined && maHeThongRap.trim() !== '') {
      parsedMaHeThongRap = parseInt(maHeThongRap, 10);
      if (isNaN(parsedMaHeThongRap)) {
        throw new BadRequestException('MaHeThongRap must be a number');
      }
    }

    return await this.quanLyRapService.LayThongTinLichChieuHeThongRap(
      parsedMaHeThongRap,
    );
  }
  @Get('LayThongTinLichChieuPhim')
  @ApiQuery({ name: 'maPhim', required: true, type: 'number' })
  async layThongTinLichChieuPhim(
    @Query('maPhim') maPhim: string,
  ): Promise<any> {
    let parsedMaHeThongRap: number | undefined;

    if (maPhim !== undefined && maPhim.trim() !== '') {
      parsedMaHeThongRap = parseInt(maPhim, 10);
      if (isNaN(parsedMaHeThongRap)) {
        throw new BadRequestException('MaPhim must be a number');
      }
    }

    return await this.quanLyRapService.layThongTinLichChieuPhim(
      parsedMaHeThongRap,
    );
  }
}

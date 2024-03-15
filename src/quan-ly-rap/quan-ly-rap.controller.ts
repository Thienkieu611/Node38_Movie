import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { QuanLyRapService } from './quan-ly-rap.service';
import { CreateQuanLyRapDto } from './dto/create-quan-ly-rap.dto';
import { UpdateQuanLyRapDto } from './dto/update-quan-ly-rap.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { HeThongRap } from '@prisma/client';
import { ThongTinRap } from './dto/thong-tin-rap.dto';

@ApiTags('QuanLyRap')
@Controller('api/QuanLyRap')
export class QuanLyRapController {
  constructor(private readonly quanLyRapService: QuanLyRapService) {}

  @Get('LayThongTinHeThongRap')
  @ApiQuery({ name: 'maHeThongRap', required: false, type: 'number' })
  async layThongTinHeThongRap(
    @Query('maHeThongRap') maHeThongRap: string,
  ): Promise<HeThongRap[]> {
    // const { maHeThongRap } = searchKey;
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
  async layThongTinLichChieuPhim() {
    return this.quanLyRapService.layThongTinLichChieuPhim();
  }
}

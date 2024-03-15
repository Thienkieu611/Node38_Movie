import { IsNumber, IsOptional, IsString } from 'class-validator';
export class SearchFilmDto {
  @IsOptional()
  @IsNumber()
  maPhim: number;

  @IsOptional()
  @IsString()
  tenPhim: string;

  @IsOptional()
  @IsNumber()
  soTrang: number;

  @IsOptional()
  @IsNumber()
  soPhanTuTrenTrang: number;

  @IsOptional()
  @IsString()
  tuNgay: string;

  @IsOptional()
  @IsString()
  denNgay: string;
}

import { IsNumber, IsOptional, IsString } from 'class-validator';
export class ThongTinRap {
  @IsOptional()
  @IsNumber()
  maHeThongRap: number;
}

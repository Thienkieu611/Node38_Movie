import { ApiProperty } from '@nestjs/swagger';

export class VeVM {
  @ApiProperty()
  maGhe: number;

  @ApiProperty()
  taiKhoan: number;
}

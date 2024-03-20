import { ApiProperty } from '@nestjs/swagger';
import { VeVM } from './ve-vm.dto';

export class DanhSachVeDat {
  @ApiProperty()
  maLichChieu: number;

  @ApiProperty({ type: [VeVM] })
  danhSachVe: VeVM[];
}

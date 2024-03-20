import { PartialType } from '@nestjs/swagger';
import { CreateQuanLyPhimDto } from './create-quan-ly-phim.dto';
import { UpdatePhimDto } from './update-phim.dto';

export class UpdateQuanLyPhimDto extends PartialType(UpdatePhimDto) {}

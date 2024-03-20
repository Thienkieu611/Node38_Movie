import { ApiProperty } from "@nestjs/swagger";

export class CreateShowtimeDto {
  @ApiProperty()
  movieId: number;

  @ApiProperty()
  showTime: string;

  @ApiProperty()
  cinemaId: number;

  @ApiProperty()
  ticketPrice: number;
}


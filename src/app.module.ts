import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuanLyPhimModule } from './quan-ly-phim/quan-ly-phim.module';
import { QuanLyRapModule } from './quan-ly-rap/quan-ly-rap.module';

@Module({
  imports: [QuanLyPhimModule, QuanLyRapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

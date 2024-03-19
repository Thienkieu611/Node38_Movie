import { Module } from '@nestjs/common';
import { ManageTicketBookedService } from './manage-ticket-booked.service';
import { ManageTicketBookedController } from './manage-ticket-booked.controller';

@Module({
  controllers: [ManageTicketBookedController],
  providers: [ManageTicketBookedService],
})
export class ManageTicketBookedModule {}

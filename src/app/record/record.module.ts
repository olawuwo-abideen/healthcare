import { Module } from '@nestjs/common';
import { RecordService } from './services/record.service';
import { RecordController } from './controllers/record.controller';

@Module({
  providers: [RecordService],
  controllers: [RecordController]
})
export class RecordModule {}

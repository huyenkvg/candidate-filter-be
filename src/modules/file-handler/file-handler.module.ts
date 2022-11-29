import { Module } from '@nestjs/common';
import { FileHandlerService } from './file-handler.service';
import { FileHandlerController } from './file-handler.controller';

@Module({
  controllers: [FileHandlerController],
  providers: [FileHandlerService]
})
export class FileHandlerModule {}

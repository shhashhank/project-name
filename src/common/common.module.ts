import { Module, Global } from '@nestjs/common';
import { ValidationService } from './services/validation.service';
import { LoggerService } from './services/logger.service';
import { BoomExceptionFilter } from './filters/boom-exception.filter';

@Global() // Make services available globally
@Module({
  providers: [ValidationService, LoggerService, BoomExceptionFilter],
  exports: [ValidationService, LoggerService, BoomExceptionFilter],
})
export class CommonModule {}

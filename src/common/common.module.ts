import { Module, Global } from '@nestjs/common';
import { ValidationService } from './services/validation.service';
import { LoggerService } from './services/logger.service';

@Global() // Make services available globally
@Module({
  providers: [ValidationService, LoggerService],
  exports: [ValidationService, LoggerService],
})
export class CommonModule {} 
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health-check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check server health status' })
  @ApiResponse({
    status: 200,
    description: 'The server is operational',
    content: { 'text/plain': { example: 'ok' } },
  })
  checkHealth(): string {
    return this.appService.getOk();
  }
}

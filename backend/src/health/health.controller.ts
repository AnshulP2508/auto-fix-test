import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/')
  root() {
    return {
      status: 'ok',
      message: 'Backend server is running',
      port: process.env.PORT || 3001,
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('/health')
  health() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}

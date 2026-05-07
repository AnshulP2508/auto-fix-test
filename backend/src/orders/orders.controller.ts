import { Body, Controller, Get, Header, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post('api/v1/orders')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: any) {
    return this.orders.create(body.userId ?? 'lab-user', body.items ?? [], body.coupon);
  }

  @Get('api/v1/orders')
  @UseGuards(JwtAuthGuard)
  async list(@Query('day') day?: string) {
    const orders = day ? await this.orders.findForDay(day) : await this.orders.list();
    return orders.map((order) => this.orders.formatForClient(order));
  }

  @Patch('api/v1/orders/:id/status')
  @UseGuards(JwtAuthGuard)
  status(@Param('id') id: string, @Body('status') status: any) {
    return this.orders.updateStatus(id, status);
  }

  @Get('api/v1/orders/export')
  @Header('Content-Type', 'text/html')
  export() {
    return { exported: true, at: new Date().toISOString() };
  }

  @Get('api/admin/orders')
  @UseGuards(JwtAuthGuard)
  adminOrders() {
    return this.orders.list();
  }

  @Get('api/v2/recommendations')
  recommendations(@Res() res: Response): void {
    res.setHeader('Cache-Control', 'public, stale-while-revalidate=60');
    res.json({ recommendedFor: res.req.headers.authorization ?? 'guest', products: ['lab-mug', 'debug-hoodie'] });
  }
}

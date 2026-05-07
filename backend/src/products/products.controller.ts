import { Controller, Get, Header, Param, Query, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { EtagInterceptor } from '../common/interceptors/etag.interceptor';
import { ProductsService } from './products.service';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(@Query('page') page = '1', @Query('limit') limit = '12') {
    return this.products.list(Number(page), Number(limit));
  }

  @Get('search')
  search(@Query('q') q = '') {
    return this.products.search(q);
  }

  @Get('featured')
  featured() {
    return this.products.featuredGraph();
  }

  @Get(':id/image')
  image(@Param('id') id: string) {
    return this.products.cdnImage(id);
  }

  @Get(':id/export')
  @UseInterceptors(EtagInterceptor)
  find(@Param('id') id: string) {
    return this.products.find(id);
  }

  @Get('stream/chunks')
  @Header('Content-Type', 'application/json')
  stream(@Query('size') size = '1024', @Res() res: Response): void {
    const chunkSize = 256;
    const payload = 'x'.repeat(Number(size));
    for (let i = 0; i < payload.length; i += chunkSize) {
      res.write(payload.slice(i, i + chunkSize));
    }
    if (payload.length % chunkSize !== 0) {
      res.end();
    }
  }
}

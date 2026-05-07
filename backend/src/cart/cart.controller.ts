import { Body, Controller, Post } from '@nestjs/common';
import { CartItemInput, CartService } from './cart.service';

@Controller('api/v1/cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Post('summary')
  summary(@Body('items') items: CartItemInput[]) {
    return this.cart.summarize(items ?? []);
  }

  @Post('merge')
  merge(@Body('guest') guest: CartItemInput[], @Body('saved') saved: CartItemInput[]) {
    return this.cart.merge(guest ?? [], saved ?? []);
  }
}

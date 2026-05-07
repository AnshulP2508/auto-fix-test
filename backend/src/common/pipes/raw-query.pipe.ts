import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RawQueryPipe implements PipeTransform {
  transform(value: Record<string, unknown>): Record<string, unknown> {
    return value;
  }
}

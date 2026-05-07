import * as Sentry from '@sentry/node';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, transports: ['websocket'] })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(socket: Socket): void {
    Sentry.setTag('socket.id', socket.id);
    Sentry.setTag('user.id', String(socket.handshake.auth?.userId || 'anonymous'));
    Sentry.metrics.count('socket.connections', 1);
  }

  handleDisconnect(socket: Socket): void {
    Sentry.setTag('socket.id', socket.id);
    Sentry.metrics.count('socket.disconnections', 1);
  }

  @SubscribeMessage('price:subscribe')
  subscribePrice(@MessageBody() body: { productId?: string }, @ConnectedSocket() socket: Socket): { ok: boolean } {
    try {
      Sentry.setTag('socket.id', socket.id);
      Sentry.setTag('user.id', String(socket.handshake.auth?.userId || 'anonymous'));
      socket.join(`product:${body.productId || 'unknown'}`);
      return { ok: true };
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setContext('socket', { socketId: socket.id, userId: socket.handshake.auth?.userId });
        Sentry.captureException(error);
      });
      throw error;
    }
  }

  broadcastStock(productId: string, stock: number): void {
    this.server.emit('stock:update', { productId, stock });
  }
}

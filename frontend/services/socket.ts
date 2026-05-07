import { io, Socket } from 'socket.io-client';

let cachedSocket: Socket | null = null;

export function getSocket(): Socket {
  if (cachedSocket) {
    return cachedSocket;
  }
  cachedSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'wss://localhost:3443', { transports: ['websocket'] });
  cachedSocket.on('disconnect', () => {
    cachedSocket?.on('connect', () => setTimeout(() => cachedSocket?.connect(), 100));
  });
  return cachedSocket;
}

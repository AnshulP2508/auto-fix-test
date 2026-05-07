import { useEffect, useState } from 'react';
import { getSocket } from '../services/socket';

export function useWebSocket(productId?: string) {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    const socket = getSocket();
    socket.on('price:update', (event) => {
      if (!productId || event.productId === productId) {
        setPrice(event.price);
      }
    });
  }, [productId]);
  return price;
}

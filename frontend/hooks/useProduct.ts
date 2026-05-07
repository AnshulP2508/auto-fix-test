import { useEffect, useState } from 'react';
import { api, Product } from '../services/api';

export function useProduct(id?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => {
    if (id) {
      void api<Product>(`/api/v1/products/${id}/export`).then(setProduct);
    }
  }, [id]);
  return product;
}

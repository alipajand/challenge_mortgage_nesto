import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api/endpoints';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: ({ signal }) => getProducts(signal),
    staleTime: 5 * 60 * 1000,
  });
}

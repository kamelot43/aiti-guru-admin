import { useEffect } from 'react';
import { Product } from '../api/productsApi';

type SortState = {
  field?: keyof Product;
  order?: 'ascend' | 'descend';
};

export function useProductsHydrateFromUrl(opts: {
  searchParams: URLSearchParams;

  setSearchInput: (v: string) => void;
  setSearchQuery: (v: string) => void;
  setPage: (v: number) => void;
  setSort: (v: SortState) => void;
  setHydrated: (v: boolean) => void;
}) {
  const { searchParams, setSearchInput, setSearchQuery, setPage, setSort, setHydrated } = opts;

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    const pageFromUrl = Number(searchParams.get('page') ?? '1');
    const sortBy = searchParams.get('sortBy') ?? undefined;
    const order = searchParams.get('order') as 'asc' | 'desc' | null;

    setSearchInput(q);
    setSearchQuery(q);
    setPage(Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1);

    if (sortBy && (order === 'asc' || order === 'desc')) {
      setSort({
        field: sortBy as keyof Product,
        order: order === 'asc' ? 'ascend' : 'descend',
      });
    } else {
      setSort({});
    }

    setHydrated(true);
  }, []);
}

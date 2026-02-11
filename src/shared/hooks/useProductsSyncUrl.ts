import { useEffect } from 'react';
import {Product} from "../api/productsApi";

type SortState = {
    field?: keyof Product;
    order?: 'ascend' | 'descend';
};

export function useProductsSyncUrl(opts: {
    searchParams: URLSearchParams;
    setSearchParams: (nextInit: URLSearchParams, options?: { replace?: boolean }) => void;

    searchQuery: string;
    page: number;
    sort: SortState;
}) {
    const { searchParams, setSearchParams, searchQuery, page, sort } = opts;

    useEffect(() => {
        const next = new URLSearchParams(searchParams);

        const q = searchQuery.trim();
        if (q) next.set('q', q);
        else next.delete('q');

        if (page > 1) next.set('page', String(page));
        else next.delete('page');

        if (sort.field && sort.order) {
            next.set('sortBy', String(sort.field));
            next.set('order', sort.order === 'ascend' ? 'asc' : 'desc');
        } else {
            next.delete('sortBy');
            next.delete('order');
        }

        setSearchParams(next, { replace: true });
    }, [searchQuery, page, sort]);
}

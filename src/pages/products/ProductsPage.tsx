import debounce from 'lodash.debounce';
import { Button, Input, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Key } from 'react';

import styles from './ProductsPage.module.scss';
import type { Product } from '../../shared/api/productsApi';
import { fetchProducts, addProductApi, updateProductApi } from '../../shared/api/productsApi';
import {
  ProductModal,
  type ProductFormValues,
} from '../../shared/components/ProductModal/ProductModal';
import { ProductsTable } from '../../shared/components/ProductsTable/ProductsTable';

type SortState = {
  field?: keyof Product;
  order?: 'ascend' | 'descend';
};

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortState>({});
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>('create');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [rows, setRows] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        setPage(1);
      }, 800),
    [],
  );

  const pageSize = 20;

  const openCreate = () => {
    setProductModalMode('create');
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setProductModalMode('edit');
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const closeModal = () => setIsProductModalOpen(false);

  const skip = useMemo(() => (page - 1) * pageSize, [page, pageSize]);
  const sortBy = sort.field ? String(sort.field) : undefined;
  const order = sort.order ? (sort.order === 'ascend' ? 'asc' : 'desc') : undefined;

  const load = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const res = await fetchProducts({
        limit: pageSize,
        skip,
        search: searchQuery.trim() ? searchQuery.trim() : undefined,
        sortBy,
        order,
        signal: controller.signal,
      });

      setRows(res.products);
      setTotal(res.total);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      message.error('Не удалось загрузить товары');
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  };

  useEffect(() => {
    if (!hydrated) return;

    void load();
  }, [hydrated, page, pageSize, skip, sortBy, order, searchQuery]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel();
    };
  }, [debouncedSetSearchQuery]);

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

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Typography.Title level={3} className={styles.topTitle}>
          Товары
        </Typography.Title>

        <Input
          value={searchInput}
          onChange={(e) => {
            const value = e.target.value;
            setSearchInput(value);
            debouncedSetSearchQuery(value);
          }}
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Найти"
          className={styles.search}
          disabled={loading}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <Typography.Title level={4} className={styles.sectionTitle}>
            Все позиции
          </Typography.Title>

          <div className={styles.headerActions}>
            <Button icon={<ReloadOutlined />} onClick={load} loading={loading} disabled={loading} />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Добавить
            </Button>
          </div>
        </div>

        <ProductsTable
          rows={rows}
          total={total}
          page={page}
          pageSize={pageSize}
          loading={loading}
          sort={sort}
          selectedRowKeys={selectedRowKeys}
          onSelectedRowKeysChange={setSelectedRowKeys}
          onPageChange={setPage}
          onSortChange={(nextSort) => {
            setSort(nextSort);
            setPage(1);
          }}
          onEdit={openEdit}
        />

        <ProductModal
          open={isProductModalOpen}
          mode={productModalMode}
          product={editingProduct}
          onClose={closeModal}
          onSubmit={async (values: ProductFormValues) => {
            try {
              if (productModalMode === 'create') {
                const created = await addProductApi(values);

                setRows((prev) => [created, ...prev]);

                message.success('Товар добавлен');
              } else if (editingProduct) {
                const updated = await updateProductApi(editingProduct.id, values);

                setRows((prev) =>
                  prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updated } : p)),
                );

                message.success('Товар обновлён');
              }

              closeModal();
            } catch {
              message.error('Ошибка операции');
            }
          }}
        />
      </div>
    </div>
  );
}

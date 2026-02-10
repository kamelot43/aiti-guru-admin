import { Button, Input, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
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
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>({});
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>('create');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [rows, setRows] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const res = await fetchProducts({
        limit: pageSize,
        skip,
        search: search.trim() ? search.trim() : undefined,
        sortBy,
        order,
      });

      setRows(res.products);
      setTotal(res.total);
    } catch (e) {
      message.error('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, pageSize, skip, sortBy, order, search]);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Typography.Title level={3} className={styles.topTitle}>
          Товары
        </Typography.Title>

        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
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

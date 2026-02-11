// react
import type { Key } from 'react';
import { useCallback, useMemo } from 'react';

// antd
import { Pagination, Table } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';

// api / types
import type { Product } from '../../api/productsApi';

// libs
import { createProductsColumns, createProductsRowSelection } from './productsTableConfig';

// styles
import styles from './ProductsTable.module.scss';

type SortState = {
  field?: keyof Product;
  order?: 'ascend' | 'descend';
};

type Props = {
  rows: Product[];
  total: number;
  page: number;
  pageSize: number;
  loading?: boolean;
  sort: SortState;

  selectedRowKeys: Key[];
  onSelectedRowKeysChange: (keys: Key[]) => void;

  onPageChange: (page: number) => void;
  onSortChange: (sort: SortState) => void;

  onEdit: (product: Product) => void;
};

export function ProductsTable({
  rows,
  total,
  page,
  pageSize,
  loading = false,
  sort: _sort,
  selectedRowKeys,
  onSelectedRowKeysChange,
  onPageChange,
  onSortChange,
  onEdit,
}: Props) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const allCheckedOnPage = rows.length > 0 && rows.every((r) => selectedRowKeys.includes(r.id));

  const toggleSelectAllOnPage = useCallback(() => {
    onSelectedRowKeysChange(
      (() => {
        const pageIds: Key[] = rows.map((r) => r.id as Key);
        const allSelected =
          pageIds.length > 0 && pageIds.every((id) => selectedRowKeys.includes(id));

        if (allSelected) {
          return selectedRowKeys.filter((k) => !pageIds.includes(k));
        }

        const next = new Set<Key>(selectedRowKeys);
        pageIds.forEach((id) => next.add(id));
        return Array.from(next);
      })(),
    );
  }, [rows, selectedRowKeys, onSelectedRowKeysChange]);

  const columns = useMemo(() => createProductsColumns({ styles, onEdit }), [onEdit]);

  const rowSelection = useMemo(
    () =>
      createProductsRowSelection({
        styles,
        selectedRowKeys,
        onSelectedRowKeysChange,
        allCheckedOnPage,
        onToggleSelectAllOnPage: toggleSelectAllOnPage,
      }),
    [selectedRowKeys, onSelectedRowKeysChange, allCheckedOnPage, toggleSelectAllOnPage],
  );

  const onChangeTable = (
    _pagination: TablePaginationConfig,
    _filters: Record<string, unknown>,
    sorter: SorterResult<Product> | SorterResult<Product>[],
  ) => {
    const next = Array.isArray(sorter) ? sorter[0] : sorter;
    const { order: nextOrder, field: nextField } = next ?? {};

    if (!nextOrder) {
      onSortChange({});
      return;
    }

    const field = Array.isArray(nextField) ? nextField[0] : nextField;

    if (!field) {
      onSortChange({});
      return;
    }

    onSortChange({
      field: field as keyof Product,
      order: nextOrder as SortState['order'],
    });
  };

  return (
    <div className={styles.wrap}>
      <Table<Product>
        rowKey="id"
        loading={loading}
        onRow={(record) => ({
          onClick: () => {
            onSelectedRowKeysChange(
              (() => {
                const has = selectedRowKeys.includes(record.id);
                return has
                  ? selectedRowKeys.filter((k) => k !== record.id)
                  : [...selectedRowKeys, record.id];
              })(),
            );
          },
        })}
        dataSource={rows}
        columns={columns}
        pagination={false}
        onChange={onChangeTable}
        rowSelection={rowSelection}
        rowClassName={(record) => (selectedRowKeys.includes(record.id) ? styles.rowSelected : '')}
        className={styles.table}
      />

      <div className={styles.footer}>
        <div className={styles.counter}>
          Показано{' '}
          <span>
            {from}-{to}
          </span>{' '}
          из <span>{total}</span>
        </div>

        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={false}
          disabled={loading}
        />
      </div>
    </div>
  );
}

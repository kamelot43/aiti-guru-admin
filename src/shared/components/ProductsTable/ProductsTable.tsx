import { Button, Pagination, Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import type { Key } from 'react';

import styles from './ProductsTable.module.scss';
import type {ProductRow} from "../../../pages/products/products.mock";

type SortState = {
  field?: keyof ProductRow;
  order?: 'ascend' | 'descend';
};

type Props = {
  data: ProductRow[];
  page: number;
  pageSize: number;

  selectedRowKeys: Key[];
  onSelectedRowKeysChange: (keys: Key[]) => void;

  onPageChange: (page: number) => void;
  onSortChange: (sort: SortState) => void;

  onEdit: (product: ProductRow) => void;
};

function formatPriceRub(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function ProductsTable({
  data,
  page,
  pageSize,
  selectedRowKeys,
  onSelectedRowKeysChange,
  onPageChange,
  onSortChange,
  onEdit,
}: Props) {
  const total = data.length;

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const allCheckedOnPage =
    pageData.length > 0 && pageData.every((r) => selectedRowKeys.includes(r.id));

  const toggleSelectAllOnPage = () => {
    onSelectedRowKeysChange(
      (() => {
        const pageIds = pageData.map((r) => r.id);
        const allSelected =
          pageIds.length > 0 && pageIds.every((id) => selectedRowKeys.includes(id));

        if (allSelected) {
          return selectedRowKeys.filter((k) => !pageIds.includes(k as any));
        }

        const next = new Set(selectedRowKeys);
        pageIds.forEach((id) => next.add(id as any));
        return Array.from(next);
      })(),
    );
  };

  const columns: ColumnsType<ProductRow> = [
    {
      title: 'Наименование',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      render: (_, row) => (
        <div className={styles.nameCell}>
          <div className={styles.thumb} />
          <div className={styles.nameText}>
            <div className={styles.nameTitle}>{row.title}</div>
            <div className={styles.nameSub}>{row.category}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Вендор',
      dataIndex: 'brand',
      key: 'brand',
      sorter: true,
      render: (v: string) => <span className={styles.vendor}>{v}</span>,
    },
    { title: 'Артикул', dataIndex: 'sku', key: 'sku', sorter: true },
    {
      title: 'Оценка',
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      render: (rating: number) => {
        const cls = rating < 3 ? styles.ratingBad : styles.ratingOk;
        return <span className={cls}>{rating.toFixed(1)}/5</span>;
      },
    },
    {
      title: 'Цена, ₽',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      sorter: true,
      render: (price: number) => <span className={styles.price}>{formatPriceRub(price)}</span>,
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      align: 'right',
      render: (_: unknown, row: ProductRow) => (
        <div className={styles.rowActions}>
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            className={styles.addToCartBtn}
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            type="default"
            shape="circle"
            icon={<MoreOutlined />}
            className={styles.moreBtn}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
          />
        </div>
      ),
    },
    { title: '', key: 'spacer', width: 120, render: () => null },
  ];

  const rowSelection: TableRowSelection<ProductRow> = {
    selectedRowKeys,
    onChange: (keys) => onSelectedRowKeysChange(keys),

    columnTitle: (
      <button
        type="button"
        className={`${styles.tableCheckbox} ${allCheckedOnPage ? styles.tableCheckboxChecked : ''}`}
        aria-checked={allCheckedOnPage}
        role="checkbox"
        onClick={(e) => {
          e.stopPropagation();
          toggleSelectAllOnPage();
        }}
      />
    ),

    renderCell: (checked, record) => (
      <button
        type="button"
        className={`${styles.tableCheckbox} ${checked ? styles.tableCheckboxChecked : ''}`}
        aria-checked={checked}
        role="checkbox"
        onClick={(e) => {
          e.stopPropagation();
          onSelectedRowKeysChange(
            (() => {
              const has = selectedRowKeys.includes(record.id);
              return has
                ? selectedRowKeys.filter((k) => k !== record.id)
                : [...selectedRowKeys, record.id];
            })(),
          );
        }}
      />
    ),
  };

  const onChangeTable = (
    _pagination: TablePaginationConfig,
    _filters: Record<string, unknown>,
    sorter: any,
  ) => {
    const next = Array.isArray(sorter) ? sorter[0] : sorter;
    if (!next?.order) {
      onSortChange({});
      return;
    }
    onSortChange({ field: next.field as keyof ProductRow, order: next.order });
  };

  return (
    <div className={styles.wrap}>
      <Table<ProductRow>
        rowKey="id"
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
        dataSource={pageData}
        columns={columns}
        pagination={false}
        onChange={onChangeTable}
        rowSelection={rowSelection}
        rowClassName={(record) => (selectedRowKeys.includes(record.id) ? styles.rowSelected : '')}
        className={styles.table}
      />

      <div className={styles.footer}>
        <div className={styles.counter}>
          Показано {from}-{to} из {total}
        </div>

        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}

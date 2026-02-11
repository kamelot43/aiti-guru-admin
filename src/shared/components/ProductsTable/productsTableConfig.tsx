import type { Key } from 'react';
import { Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';

import type { Product } from '../../api/productsApi';
import formatPriceParts from '../../lib/formatPriceParts';

type CreateColumnsArgs = {
  styles: Record<string, string>;
  onEdit: (product: Product) => void;
};

export function createProductsColumns({ styles, onEdit }: CreateColumnsArgs): ColumnsType<Product> {
  return [
    {
      title: 'Наименование',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      render: (_: unknown, row: Product) => (
        <div className={styles.nameCell}>
          <div className={styles.thumb}>
            {row.thumbnail && <img src={row.thumbnail} alt={row.title} loading="lazy" />}
          </div>
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
    {
      title: 'Артикул',
      dataIndex: 'sku',
      key: 'sku',
      sorter: true,
      render: (v: string) => <span className={styles.sku}>{v}</span>,
    },
    {
      title: 'Оценка',
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      render: (rating: number) => {
        const safe = typeof rating === 'number' ? rating : 0;
        const cls = safe < 3 ? styles.ratingBad : styles.ratingOk;
        return <span className={cls}>{safe.toFixed(1)}/5</span>;
      },
    },
    {
      title: 'Цена, ₽',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      sorter: true,
      render: (price: number) => {
        const safe = typeof price === 'number' ? price : 0;
        const { rub, kop } = formatPriceParts(safe);

        return (
          <span className={styles.price}>
            {rub}
            <span className={styles.priceFraction}>,{kop}</span>
          </span>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      align: 'right',
      render: (_: unknown, row: Product) => (
        <div className={styles.rowActions}>
          <Button
            type="primary"
            shape="round"
            size="small"
            icon={<PlusOutlined />}
            className={styles.addToCartBtn}
            onClick={(e) => {
              e.stopPropagation();
              message.success('Товар добавлен в корзину');
            }}
          />
          <Button
            type="default"
            shape="circle"
            size="small"
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
}

type CreateRowSelectionArgs = {
  styles: Record<string, string>;
  selectedRowKeys: Key[];
  onSelectedRowKeysChange: (keys: Key[]) => void;
  allCheckedOnPage: boolean;
  onToggleSelectAllOnPage: () => void;
};

export function createProductsRowSelection({
  styles,
  selectedRowKeys,
  onSelectedRowKeysChange,
  allCheckedOnPage,
  onToggleSelectAllOnPage,
}: CreateRowSelectionArgs): TableRowSelection<Product> {
  return {
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
          onToggleSelectAllOnPage();
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
          const has = selectedRowKeys.includes(record.id);
          onSelectedRowKeysChange(
            has ? selectedRowKeys.filter((k) => k !== record.id) : [...selectedRowKeys, record.id],
          );
        }}
      />
    ),
  };
}

import { Button, Input, Pagination, Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { PlusOutlined, ReloadOutlined, SearchOutlined, MoreOutlined } from "@ant-design/icons";
import {ProductModal, type ProductFormValues} from "../../shared/components/ProductModal/ProductModal";
import { useMemo, useState } from "react";
import type { Key } from "react";
import styles from "./ProductsPage.module.scss";
import type { TableRowSelection } from "antd/es/table/interface";
import { productsMock, type ProductRow } from "./products.mock";

type SortState = {
  field?: keyof ProductRow;
  order?: "ascend" | "descend";
};

function formatPriceRub(value: number) {
  return new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ field: undefined, order: undefined });
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);

  const openCreate = () => {
    setProductModalMode("create");
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const openEdit = (p: ProductRow) => {
    setProductModalMode("edit");
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const closeModal = () => setIsProductModalOpen(false);

  const pageSize = 20;

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();

    let filtered = productsMock;
    if (q) {
      filtered = productsMock.filter((p) => {
        return (
            p.title.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
      });
    }

    // пока делаем сортировку на фронте (мок). Потом заменим на API sortBy/order
    if (sort.field && sort.order) {
      const dir = sort.order === "ascend" ? 1 : -1;
      filtered = [...filtered].sort((a, b) => {
        const av = a[sort.field!];
        const bv = b[sort.field!];

        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        return String(av).localeCompare(String(bv), "ru") * dir;
      });
    }

    return filtered;
  }, [search, sort]);

  const total = data.length;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page]);

  const columns: ColumnsType<ProductRow> = [
    {
      title: "Наименование",
      dataIndex: "title",
      key: "title",
      sorter: true,
      sortOrder: sort.field === "title" ? sort.order : undefined,
      render: (_, row) => {
        return (
            <div className={styles.nameCell}>
              <div className={styles.thumb} />
              <div className={styles.nameText}>
                <div className={styles.nameTitle}>{row.title}</div>
                <div className={styles.nameSub}>{row.category}</div>
              </div>
            </div>
        );
      },
    },
    {
      title: "Вендор",
      dataIndex: "brand",
      key: "brand",
      sorter: true,
      sortOrder: sort.field === "brand" ? sort.order : undefined,
      render: (v: string) => <span className={styles.vendor}>{v}</span>,
    },
    {
      title: "Артикул",
      dataIndex: "sku",
      key: "sku",
      sorter: true,
      sortOrder: sort.field === "sku" ? sort.order : undefined,
    },
    {
      title: "Оценка",
      dataIndex: "rating",
      key: "rating",
      sorter: true,
      sortOrder: sort.field === "rating" ? sort.order : undefined,
      render: (rating: number) => {
        const cls = rating < 3 ? styles.ratingBad : styles.ratingOk;
        return <span className={cls}>{rating.toFixed(1)}/5</span>;
      },
    },
    {
      title: "Цена, ₽",
      dataIndex: "price",
      key: "price",
      align: "right",
      sorter: true,
      sortOrder: sort.field === "price" ? sort.order : undefined,
      render: (price: number) => <span className={styles.price}>{formatPriceRub(price)}</span>,
    },
    {
      title: "",
      key: "actions",
      width: 120,
      align: "right",
      render: (_: unknown, row: ProductRow) => (
          <div className={styles.rowActions}>
            <button className={styles.addToCartBtn} type="button" aria-label="Добавить в корзину">
              <PlusOutlined />
            </button>
            <button
                className={styles.moreBtn}
                type="button"
                aria-label="Меню"
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(row);
                }}
            >
              <MoreOutlined />
            </button>
          </div>
      ),
    },
    {
      title: "",
      key: "spacer",
      width: 120,
      render: () => null,
    },
  ];

  const allCheckedOnPage =
      pageData.length > 0 && pageData.every((r) => selectedRowKeys.includes(r.id));

  const toggleSelectAllOnPage = () => {
    setSelectedRowKeys((prev) => {
      const pageIds = pageData.map((r) => r.id);
      const allSelected = pageIds.length > 0 && pageIds.every((id) => prev.includes(id));

      // если все выбраны на странице — снимаем только их
      if (allSelected) {
        return prev.filter((k) => !pageIds.includes(k as any));
      }

      // если не все — добавляем недостающие (оставляя выбор с других страниц)
      const next = new Set(prev);
      pageIds.forEach((id) => next.add(id as any));
      return Array.from(next);
    });
  };



  const rowSelection: TableRowSelection<ProductRow> = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),

    columnTitle: (
        <button
            type="button"
            className={`${styles.tableCheckbox} ${allCheckedOnPage ? styles.tableCheckboxChecked : ""}`}
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
            className={`${styles.tableCheckbox} ${checked ? styles.tableCheckboxChecked : ""}`}
            aria-checked={checked}
            role="checkbox"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRowKeys((prev) => {
                const has = prev.includes(record.id);
                return has ? prev.filter((k) => k !== record.id) : [...prev, record.id];
              });
            }}
        />
    ),
  };


  const onChangeTable = (
      _pagination: TablePaginationConfig,
      _filters: Record<string, unknown>,
      sorter: any
  ) => {
    // sorter может быть объектом или массивом, нам нужен один
    const next = Array.isArray(sorter) ? sorter[0] : sorter;

    // если сортировку сняли
    if (!next?.order) {
      setSort({ field: undefined, order: undefined });
      return;
    }

    setSort({ field: next.field as keyof ProductRow, order: next.order });
  };

  return (
      <div className={styles.page}>
        {/* Top bar */}
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
          />
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.sectionHeader}>
            <Typography.Title level={4} className={styles.sectionTitle}>
              Все позиции
            </Typography.Title>

            <div className={styles.headerActions}>
              <Button icon={<ReloadOutlined />} className={styles.refreshBtn} />
              <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className={styles.addBtn}
                  onClick={openCreate}
              >
                Добавить
              </Button>
            </div>
          </div>

          <Table<ProductRow>
              rowKey="id"
              onRow={(record) => ({
                onClick: () => {
                  setSelectedRowKeys((prev) => {
                    const has = prev.includes(record.id);
                    return has ? prev.filter((k) => k !== record.id) : [...prev, record.id];
                  });
                },
              })}
              dataSource={pageData}
              columns={columns}
              pagination={false}
              onChange={onChangeTable}
              rowSelection={rowSelection}
              rowClassName={(record) =>
                  selectedRowKeys.includes(record.id) ? styles.rowSelected : ""
              }
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
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
            />
            <ProductModal
                open={isProductModalOpen}
                mode={productModalMode}
                product={editingProduct}
                onClose={closeModal}
                onSubmit={(values: ProductFormValues) => {
                  console.log(productModalMode, editingProduct?.id, values);
                  closeModal();
                }}
            />
          </div>
        </div>
      </div>
  );
}

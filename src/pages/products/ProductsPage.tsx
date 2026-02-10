import { Button, Input, Typography } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import type { Key } from "react";

import styles from "./ProductsPage.module.scss";
import { productsMock, type ProductRow } from "./products.mock";
import { ProductModal, type ProductFormValues } from "../../shared/components/ProductModal/ProductModal";
import {ProductsTable} from "../../shared/components/ProductsTable/ProductsTable";

type SortState = {
  field?: keyof ProductRow;
  order?: "ascend" | "descend";
};

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({});
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);

  const pageSize = 20;

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
          />
        </div>

        <div className={styles.content}>
          <div className={styles.sectionHeader}>
            <Typography.Title level={4} className={styles.sectionTitle}>
              Все позиции
            </Typography.Title>

            <div className={styles.headerActions}>
              <Button icon={<ReloadOutlined />} />
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                Добавить
              </Button>
            </div>
          </div>

          <ProductsTable
              data={data}
              page={page}
              pageSize={pageSize}
              selectedRowKeys={selectedRowKeys}
              onSelectedRowKeysChange={setSelectedRowKeys}
              onPageChange={setPage}
              onSortChange={setSort}
              onEdit={openEdit}
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
  );
}

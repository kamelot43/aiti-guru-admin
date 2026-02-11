// react
import { useEffect } from 'react';

// antd
import { Button, Form, Input, InputNumber, Modal } from 'antd';

// api / types
import type { Product } from '../../api/productsApi';

// styles
import styles from './ProductModal.module.scss';

export type ProductModalMode = 'create' | 'edit';

export type ProductFormValues = {
  title: string;
  price: number;
  brand: string;
  sku: string;
};

type Props = {
  open: boolean;
  mode: ProductModalMode;
  product?: Product | null;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
};

export function ProductModal({ open, mode, product, onClose, onSubmit }: Props) {
  const [form] = Form.useForm<ProductFormValues>();

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && product) {
      form.setFieldsValue({
        title: product.title,
        price: product.price,
        brand: product.brand,
        sku: product.sku,
      });
    } else {
      form.resetFields();
    }
  }, [open, mode, product, form]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      destroyOnHidden
      title={mode === 'create' ? 'Добавление товара' : 'Редактирование товара'}
      className={styles.modal}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button key="save" type="primary" onClick={() => form.submit()}>
          Сохранить
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
        onFinish={(values) => onSubmit(values)}
      >
        <Form.Item
          label="Наименование"
          name="title"
          rules={[{ required: true, message: 'Введите наименование' }]}
        >
          <Input placeholder="Введите наименование" />
        </Form.Item>

        <div className={styles.grid}>
          <Form.Item
            label="Цена, руб"
            name="price"
            rules={[{ required: true, message: 'Введите цену' }]}
          >
            <InputNumber className={styles.fullWidth} min={0} placeholder="0" controls={false} />
          </Form.Item>

          <Form.Item label="Вендор" name="brand">
            <Input placeholder="Введите вендора" />
          </Form.Item>
        </div>

        <Form.Item
          label="Артикул"
          name="sku"
          rules={[{ required: true, message: 'Введите артикул' }]}
        >
          <Input placeholder="Введите артикул" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

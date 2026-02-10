import { Button, Checkbox, Divider, Form, Input } from 'antd';
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import cn from 'classnames';
import styles from './LoginForm.module.scss';

export type LoginFormValues = {
  username: string;
  password: string;
  remember: boolean;
};

type Props = {
  initialValues?: Partial<LoginFormValues>;
  onSubmit?: (values: LoginFormValues) => void;
  onCreateAccountClick?: () => void;
};

export function LoginForm({ initialValues, onSubmit, onCreateAccountClick }: Props) {
  const [form] = Form.useForm<LoginFormValues>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Form<LoginFormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ username: '', password: '', remember: false, ...initialValues }}
      onFinish={(values) => onSubmit?.(values)}
    >
      <Form.Item
        label="Логин"
        name="username"
        rules={[{ required: true, message: 'Обязательное поле' }]}
      >
        <Input
          size="large"
          placeholder=""
          prefix={<UserOutlined className={styles.icon} />}
          suffix={
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => form.setFieldValue('username', '')}
              aria-label="Очистить"
            >
              <CloseOutlined />
            </button>
          }
        />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Обязательное поле' }]}
      >
        <Input
          size="large"
          type={isPasswordVisible ? 'text' : 'password'}
          prefix={<LockOutlined className={styles.icon} />}
          suffix={
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => setIsPasswordVisible((v) => !v)}
              aria-label="Показать/скрыть пароль"
            >
              <EyeInvisibleOutlined />
            </button>
          }
        />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" className={styles.rememberItem}>
        <Checkbox>Запомнить данные</Checkbox>
      </Form.Item>

      <Button type="primary" htmlType="submit" size="large" block>
        Войти
      </Button>

      <Divider className={styles.divider}>
        <span className={styles.dividerText}>или</span>
      </Divider>

      <div className={styles.bottom}>
        <span className={styles.bottomText}>Нет аккаунта?</span>
        <button type="button" className={cn(styles.link)} onClick={() => onCreateAccountClick?.()}>
          Создать
        </button>
      </div>
    </Form>
  );
}

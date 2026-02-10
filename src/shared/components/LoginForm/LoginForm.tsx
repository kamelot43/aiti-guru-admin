import { Button, Checkbox, Divider, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import cn from 'classnames';
import styles from './LoginForm.module.scss';
import { loginApi } from "../../api/auth";
import { useAuth } from "../../../app/providers/AuthProvider";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    form.setFields([
      { name: "username", errors: [] },
      { name: "password", errors: [] },
    ]);

    try {
      const res = await loginApi({
        username: values.username,
        password: values.password,
        expiresInMins: 60,
      });

      auth.setSession(res.accessToken, values.remember ? "persist" : "session");
      message.success("Успешный вход");
      navigate("/products", { replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Ошибка авторизации";
      form.setFields([
        { name: "username", errors: [] },
        { name: "password", errors: [msg] },
      ]);

      message.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form<LoginFormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ username: "", password: "", remember: false }}
      onFinish={onFinish}
      disabled={isSubmitting}
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

      <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
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

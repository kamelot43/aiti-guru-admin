import { Button, Checkbox, Divider, Form, Input } from 'antd';
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, CloseOutlined } from '@ant-design/icons';
import cn from 'classnames';
import styles from './LoginPage.module.scss';
import { useState } from 'react';
import logo from '../../../src/assets/logo.svg';

type LoginFormValues = {
  username: string;
  password: string;
  remember: boolean;
};

export function LoginPage() {
  const [form] = Form.useForm<LoginFormValues>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" />
        </div>

        <h1 className={styles.title}>Добро пожаловать!</h1>
        <p className={styles.subtitle}>Пожалуйста, авторизируйтесь</p>

        <Form<LoginFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{ username: '', password: '', remember: false }}
          onFinish={(values) => console.log(values)}
          className={styles.form}
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
              className={styles.input}
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
              className={styles.input}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" className={styles.rememberItem}>
            <Checkbox className={styles.checkbox}>Запомнить данные</Checkbox>
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block>
            Войти
          </Button>

          <Divider className={styles.divider}>
            <span className={styles.dividerText}>или</span>
          </Divider>

          <div className={styles.bottom}>
            <span className={styles.bottomText}>Нет аккаунта?</span>
            <button type="button" className={cn(styles.link)} onClick={() => console.log('stub')}>
              Создать
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

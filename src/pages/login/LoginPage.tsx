import styles from './LoginPage.module.scss';
import logo from '../../../src/assets/logo.svg';
import { LoginForm, type LoginFormValues } from '../../shared/components/LoginForm/LoginForm';

export function LoginPage() {
  const handleSubmit = (values: LoginFormValues) => {
    console.log(values);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" />
        </div>

        <h1 className={styles.title}>Добро пожаловать!</h1>
        <p className={styles.subtitle}>Пожалуйста, авторизируйтесь</p>

        <LoginForm onSubmit={handleSubmit} onCreateAccountClick={() => console.log('stub')} />
      </div>
    </div>
  );
}

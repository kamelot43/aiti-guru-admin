import styles from './LoginPage.module.scss';
import logo from '../../../src/assets/logo.svg';
import { LoginForm, type LoginFormValues } from '../../shared/components/LoginForm/LoginForm';

export function LoginPage() {
  const handleSubmit = (values: LoginFormValues) => {
    console.log(values);
  };

  return (
    <div className={styles.page}>
      <div className={styles.cardOuter}>
        <div className={styles.cardInner}>
          <div className={styles.logo}>
            <img src={logo} alt="Logo" />
          </div>

          <div>
            <h1 className={styles.title}>Добро пожаловать<span className={styles.exclamation}>!</span></h1>
            <p className={styles.subtitle}>Пожалуйста, авторизируйтесь</p>
          </div>

          <LoginForm onSubmit={handleSubmit} onCreateAccountClick={() => console.log('stub')} />
        </div>
      </div>
    </div>
  );
}

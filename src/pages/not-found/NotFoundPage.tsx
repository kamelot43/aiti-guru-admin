import { Button } from 'antd';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.code}>404</div>
        <div className={styles.title}>Страница не найдена</div>
        <div className={styles.desc}>Возможно, ссылка устарела или страница была перемещена.</div>

        <div className={styles.actions}>
          <Link to="/products">
            <Button type="primary" size="middle">
              На главную
            </Button>
          </Link>

          <Button size="middle" onClick={() => window.history.back()}>
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
}

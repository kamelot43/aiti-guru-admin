import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="space-y-3 text-center">
        <div className="text-2xl font-semibold">Страница не найдена</div>
        <Link className="underline" to="/products">
          На главную
        </Link>
      </div>
    </div>
  );
}

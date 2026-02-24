# Aiti Guru Admin

Административное веб-приложение (тестовое задание) с авторизацией и страницей списка товаров.
Основной фокус — работа с таблицами, формами и взаимодействием с публичным API.

## Деплой
https://aiti-guru-admin-iota.vercel.app/

## Функциональность

### Авторизация
- Форма входа с валидацией обязательных полей.
- Обработка ошибок авторизации (ошибка от API показывается пользователю).
- Запоминание сессии:
    - **Remember = true** → токен сохраняется в `localStorage` (сессия переживает закрытие браузера).
    - **Remember = false** → токен сохраняется в `sessionStorage` (сессия сбрасывается при закрытии вкладки/браузера).
- После успешного входа — редирект на страницу `/products`.

## Для тестирования авторизации:

логин: **emilys**
пароль: **emilyspass**

### Товары
- Загрузка данных из API DummyJSON Products.
- Пагинация (`limit/skip`).
- Сортировка по столбцам (с хранением состояния сортировки).
- Поиск через API (`/products/search`), оптимизированный через `lodash.debounce`.
- Обновление списка (кнопка refresh).
- Добавление товара через `/products/add` (симуляция) + toast уведомление.
- Редактирование товара через `/products/:id` (симуляция) + toast уведомление.
- UI-логика:
    - рейтинг < 3 подсвечивается красным;
    - выделение строк таблицы (без дальнейшего действия по ТЗ).

## Стек

- **React 19** + **TypeScript (strict)**
- **Vite** — сборка/дев-сервер
- **Ant Design** — UI компоненты
- **React Router** — маршрутизация (включая protected routes)
- **Sass (SCSS modules)** — стили
- **ESLint + Prettier** — качество кода и форматирование
- **lodash.debounce** — debounce для поиска

## API

Используется публичное API: **DummyJSON**
- Auth: `https://dummyjson.com/auth/login`, `https://dummyjson.com/auth/me`
- Products:
    - `GET https://dummyjson.com/products?limit=..&skip=..`
    - `GET https://dummyjson.com/products/search?q=..&limit=..&skip=..`
    - `GET https://dummyjson.com/products?sortBy=..&order=asc|desc`
    - `POST https://dummyjson.com/products/add`
    - `PUT/PATCH https://dummyjson.com/products/:id`

> Добавление/редактирование на сервере не сохраняется — API возвращает “симулированный” результат.

## Требования

- Node.js + pnpm
- Chrome (актуальная версия)

## Установка и запуск

```bash
pnpm install
pnpm dev

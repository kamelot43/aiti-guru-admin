export type ProductRow = {
    id: number;
    title: string;
    category: string;
    brand: string;
    sku: string;
    rating: number;
    price: number;
    thumbnail?: string;
};

export const productsMock: ProductRow[] = [
    {
        id: 1,
        title: "USB флэшкарта 16GB",
        category: "Аксессуары",
        brand: "Samsung",
        sku: "RCH45Q1A",
        rating: 4.3,
        price: 48652,
    },
    {
        id: 2,
        title: "Утюг Braun TexStyle 9",
        category: "Бытовая техника",
        brand: "TexStyle",
        sku: "DFCHQ1A",
        rating: 4.9,
        price: 4233,
    },
    {
        id: 3,
        title: "Смартфон Apple iPhone 17",
        category: "Телефоны",
        brand: "Apple",
        sku: "GUYHD2-X4",
        rating: 4.7,
        price: 88652,
    },
    {
        id: 4,
        title: "Игровая консоль PlaySta...",
        category: "Игровые приставки",
        brand: "Sony",
        sku: "HT45Q21",
        rating: 4.1,
        price: 56236,
    },
    {
        id: 5,
        title: "Фен Dyson Supersonic Nural",
        category: "Электроника",
        brand: "Dyson",
        sku: "FJH HGF-CR4",
        rating: 3.3,
        price: 48652,
    },
];

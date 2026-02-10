export type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  sku: string;
  stock: number;
  category: string;
  thumbnail: string;
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

type Params = {
  limit: number;
  skip: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
};

const BASE_URL = 'https://dummyjson.com';

export async function fetchProducts(params: Params): Promise<ProductsResponse> {
  const { limit, skip, sortBy, order, search } = params;

  const url = search
    ? `${BASE_URL}/products/search?q=${search}&limit=${limit}&skip=${skip}`
    : `${BASE_URL}/products?limit=${limit}&skip=${skip}${
        sortBy ? `&sortBy=${sortBy}&order=${order}` : ''
      }`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Products request failed');

  return res.json();
}

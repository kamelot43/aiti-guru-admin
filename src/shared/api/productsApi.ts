import {BASE_URL} from "./const";

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
  signal?: AbortSignal;
};

export async function fetchProducts(params: Params): Promise<ProductsResponse> {
  const { limit, skip, sortBy, order, search, signal } = params;
  let res;

  const url = search
    ? `${BASE_URL}/products/search?q=${search}&limit=${limit}&skip=${skip}`
    : `${BASE_URL}/products?limit=${limit}&skip=${skip}${
        sortBy ? `&sortBy=${sortBy}&order=${order}` : ''
      }`;

  if (signal) {
    res = await fetch(url, { signal });
  } else {
    res = await fetch(url);
  }

  if (!res.ok) throw new Error('Products request failed');

  return res.json();
}

export async function addProductApi(data: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Add product failed');
  return res.json();
}

export async function updateProductApi(id: number, data: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Update product failed');
  return res.json();
}

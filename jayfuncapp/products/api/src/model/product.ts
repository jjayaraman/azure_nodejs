export default interface Product {
  id: string;
  categoryId?: string;
  categoryName: string;
  sku: string;
  name: string;
  description: string;
  price: number;
}

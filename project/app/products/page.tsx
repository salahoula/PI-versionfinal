import React from 'react';
import { Metadata } from 'next';
import ProductList from '@/components/products/product-list';
import ProductFilters from '@/components/products/product-filters';

export const metadata: Metadata = {
  title: 'Products | MicroShop',
  description: 'Browse our extensive catalog of high-quality products',
};

export default function ProductsPage() {
  return (
    <div className="container px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <ProductFilters />
        </div>
        
        <div className="md:col-span-3">
          <ProductList />
        </div>
      </div>
    </div>
  );
}
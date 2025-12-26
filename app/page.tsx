"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { categories, Product } from "@/app/data/products";
import { useCart } from "@/app/context/CartContext";
import { ProductGrid } from "@/components/ProductGrid";
import { fetchProducts } from "@/lib/api";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const allProducts = await fetchProducts();
      setProducts(allProducts);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "Tất cả"
      ? products.reverse().slice(0, 12)
      : products.filter((product) => product.category === selectedCategory).slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-primary-100 to-primary-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            PCNhanh
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Mua PC, Laptop & Linh kiện - Dịch vụ tại nhà
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-white sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
            Sản phẩm nổi bật
          </h2>
            <Link
              href="/products"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
          {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
              <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <ProductGrid
              products={filteredProducts}
              showBrand={false}
              columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              onAddToCart={addToCart}
            />
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Dịch vụ của chúng tôi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-primary-50">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold mb-3">
                Lắp ráp PC tại nhà
              </h3>
              <p className="text-gray-600">
                Dịch vụ lắp ráp và build PC tận nơi, tiện lợi và nhanh chóng
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-primary-50">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold mb-3">
                Sửa chữa & Bảo dưỡng
              </h3>
              <p className="text-gray-600">
                Sửa chữa, vệ sinh máy tính tại nhà, hỗ trợ kỹ thuật 24/7
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-primary-50">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold mb-3">
                Cài đặt phần mềm
              </h3>
              <p className="text-gray-600">
                Cài đặt Windows, Office và các phần mềm cần thiết
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

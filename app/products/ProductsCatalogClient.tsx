'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Product, ProductCategory } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import VerticalProductShowcase from '@/components/products/VerticalProductShowcase';
import ProductDetailModal from '@/components/ui/ProductDetailModal';
import { Search, ListFilter, AlertCircle, RotateCcw, Rows, Grid3X3, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductsCatalogClientProps {
  initialProducts: Product[];
  categories: ProductCategory[];
  initialTotal?: number;
}

const PAGE_SIZE = 12;

export default function ProductsCatalogClient({
  initialProducts,
  categories,
  initialTotal
}: ProductsCatalogClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc'>('featured');
  const [viewMode, setViewMode] = useState<'vertical' | 'grid'>('vertical');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(initialTotal || initialProducts.length);
  const [totalPages, setTotalPages] = useState<number>(Math.ceil((initialTotal || initialProducts.length) / PAGE_SIZE) || 1);
  const [loading, setLoading] = useState<boolean>(false);

  // Debounce search query to prevent excessive server requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch paginated products from server
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', String(PAGE_SIZE));
      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }
      if (debouncedSearch.trim()) {
        params.set('search', debouncedSearch.trim());
      }
      if (sortBy) {
        params.set('sortBy', sortBy);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
          setTotalCount(json.total || json.data.length);
          setTotalPages(json.totalPages || Math.ceil((json.total || json.data.length) / PAGE_SIZE) || 1);
        }
      }
    } catch (err) {
      console.error('Failed to query products from API:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, debouncedSearch, sortBy]);

  // Trigger query on parameter change (after initial mount)
  const isInitialMount = React.useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: 'featured' | 'name-asc' | 'name-desc') => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-10">
      {/* Control Bar: Category Pills + Search + Sort + View Mode Toggle */}
      <div className="bg-white p-6 rounded-3xl border border-[#D9E2EC] shadow-sm space-y-5">
        
        {/* Top: Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map(cat => {
            const active = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-[#073B5C] text-white shadow-sm'
                    : 'bg-[#F3F9FB] text-[#102A43] hover:bg-[#D9E2EC]/60'
                }`}
              >
                <span>{cat.name}</span>
                {typeof cat.count === 'number' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-[#16B8B3] text-white' : 'bg-[#D9E2EC] text-[#073B5C]'}`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom: Search & Sort & View Mode */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D9E2EC]">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#334E68] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search formulations by generic or brand name..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F3F9FB] border border-[#D9E2EC] rounded-xl text-xs font-medium text-[#102A43] placeholder:text-[#334E68]/70 focus:outline-none focus:ring-2 focus:ring-[#16B8B3] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-[#334E68]">
              Showing <strong className="text-[#073B5C]">{totalCount}</strong> formulations
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-[#334E68]" />
              <select
                value={sortBy}
                onChange={e => handleSortChange(e.target.value as any)}
                className="px-3 py-2 bg-[#F3F9FB] border border-[#D9E2EC] rounded-xl text-xs font-bold text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#16B8B3]"
              >
                <option value="featured">Featured First</option>
                <option value="name-asc">Alphabetical (A–Z)</option>
                <option value="name-desc">Alphabetical (Z–A)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center bg-[#F3F9FB] border border-[#D9E2EC] p-1 rounded-xl gap-1">
              <button
                onClick={() => setViewMode('vertical')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'vertical'
                    ? 'bg-[#073B5C] text-white shadow-xs'
                    : 'text-[#334E68] hover:text-[#073B5C]'
                }`}
                title="Vertical Editorial Showcase"
              >
                <Rows className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#073B5C] text-white shadow-xs'
                    : 'text-[#334E68] hover:text-[#073B5C]'
                }`}
                title="Compact Scientific Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Product Display: Vertical Showcase vs Compact Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#16B8B3] border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-[#334E68] uppercase tracking-wider">
            Loading Formulations...
          </span>
        </div>
      ) : products.length > 0 ? (
        <>
          {viewMode === 'vertical' ? (
            <VerticalProductShowcase
              products={products}
              onQuickView={prod => setActiveModalProduct(prod)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={prod => setActiveModalProduct(prod)}
                />
              ))}
            </div>
          )}

          {/* Server-Side Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#D9E2EC]">
              <span className="text-xs text-[#334E68]">
                Page <strong className="text-[#073B5C]">{currentPage}</strong> of <strong className="text-[#073B5C]">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-[#D9E2EC] text-[#073B5C] hover:bg-[#F3F9FB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = Math.min(totalPages - 4 + i, Math.max(1, currentPage - 2 + i));
                    }
                    const active = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          active
                            ? 'bg-[#073B5C] text-white shadow-xs'
                            : 'bg-white border border-[#D9E2EC] text-[#102A43] hover:bg-[#F3F9FB]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-[#D9E2EC] text-[#073B5C] hover:bg-[#F3F9FB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#D9E2EC] space-y-4">
          <AlertCircle className="w-12 h-12 text-[#334E68]/60 mx-auto" />
          <h3 className="text-xl font-bold text-[#102A43]">
            No matching formulations found
          </h3>
          <p className="text-sm text-[#334E68] max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? `No products in our portfolio match "${searchQuery}". Please check the spelling or select a broader category filter.`
              : 'Product catalog is being updated with verified specifications.'}
          </p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      )}

      {/* Quick View Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </div>
  );
}

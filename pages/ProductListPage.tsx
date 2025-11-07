
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { SlidersHorizontal } from 'lucide-react';

const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // Mock filter options - in a real app, these would come from the API
    const brands = ['Apple', 'Sony', 'Nike', 'Samsung', 'Penguin'];
    const ratings = [4, 3, 2, 1];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const query = searchParams.get('q');
            const category = searchParams.get('category');
            
            // In a real app, you would pass filters to the API
            const productsData = await api.getProducts(query || undefined);
            
            let filteredProducts = productsData;
            if (category) {
                filteredProducts = productsData.filter(p => p.category === category);
            }

            setProducts(filteredProducts);
            setLoading(false);
        };

        fetchProducts();
    }, [searchParams]);

    const Filters = () => (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold mb-3 border-b pb-2">Brands</h3>
                <div className="space-y-2">
                    {brands.map(brand => (
                        <label key={brand} className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded text-primary focus:ring-primary-dark" />
                            <span>{brand}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-semibold mb-3 border-b pb-2">Customer Ratings</h3>
                <div className="space-y-2">
                     {ratings.map(rating => (
                        <label key={rating} className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded text-primary focus:ring-primary-dark" />
                            <span>{rating} ★ & above</span>
                        </label>
                    ))}
                </div>
            </div>
             <div>
                <h3 className="font-semibold mb-3 border-b pb-2">Price</h3>
                {/* A proper range slider would be implemented here */}
                <input type="range" min="100" max="150000" className="w-full" />
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)} 
                    className="md:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border rounded-md"
                >
                    <SlidersHorizontal size={18} /> Filters
                </button>
            </div>
            
            <div className="flex">
                <aside className="hidden md:block w-1/4 pr-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                       <h2 className="text-xl font-bold mb-4">Filters</h2>
                       <Filters />
                    </div>
                </aside>

                {isFilterOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsFilterOpen(false)}></div>
                )}
                <aside className={`fixed top-0 left-0 h-full w-3/4 max-w-sm bg-white dark:bg-gray-800 p-6 rounded-r-lg shadow-lg z-50 transform ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden`}>
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button onClick={() => setIsFilterOpen(false)}>&times;</button>
                    </div>
                    <Filters />
                </aside>


                <main className="w-full md:w-3/4">
                    {loading ? (
                        <Spinner />
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold">No Products Found</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductListPage;

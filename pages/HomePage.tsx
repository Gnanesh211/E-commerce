
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerCarousel: React.FC = () => {
    const banners = [
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
        'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvc21ldGljfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2xvdGhlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
    ];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrent(current === banners.length - 1 ? 0 : current + 1);
        }, 5000);
        return () => clearTimeout(timer);
    }, [current, banners.length]);
    
    const prevSlide = () => setCurrent(current === 0 ? banners.length - 1 : current - 1);
    const nextSlide = () => setCurrent(current === banners.length - 1 ? 0 : current + 1);

    return (
        <div className="relative w-full overflow-hidden">
            <div
                className="flex transition-transform ease-out duration-500"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {banners.map((banner, index) => (
                    <img
                        key={index}
                        src={banner}
                        alt={`Banner ${index + 1}`}
                        style={{ width: "100%", height: "550px", objectFit: "cover" }}
                        className="flex-shrink-0"
                    />
                ))}
            </div>
            <button onClick={prevSlide} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full shadow-md transition">
                <ChevronLeft className="text-gray-800" />
            </button>
            <button onClick={nextSlide} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full shadow-md transition">
                <ChevronRight className="text-gray-800" />
            </button>
             <div className="absolute bottom-4 right-0 left-0">
                <div className="flex items-center justify-center gap-2">
                {banners.map((_, i) => (
                    <div key={i} className={`transition-all w-2 h-2 bg-white rounded-full ${current === i ? "p-1.5" : "bg-opacity-50"}`} />
                ))}
                </div>
            </div>
        </div>
    );
};


const HomePage: React.FC = () => {
    const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsData, categoriesData] = await Promise.all([
                    api.getTrendingProducts(),
                    api.getCategories()
                ]);
                setTrendingProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Failed to fetch homepage data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="min-h-screen"><Spinner /></div>;
    }

    return (
        <div className="space-y-8">
            <BannerCarousel />
            
            <div className="container mx-auto px-4">
                {/* Categories Section */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Shop by Category</h2>
                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 text-center">
                        {categories.map(category => (
                            <Link key={category.id} to={`/products?category=${category.name}`} className="flex flex-col items-center group">
                                <img src={category.imageUrl} alt={category.name} className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition" />
                                <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-dark">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Trending Products Section */}
                <div className="mt-8">
                     <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Trending Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trendingProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

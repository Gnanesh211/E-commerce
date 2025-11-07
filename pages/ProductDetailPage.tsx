
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import Spinner from '../components/Spinner';
import StarRating from '../components/StarRating';
import { ShoppingCart, Zap } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string>('');
    const { addToCart } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            setLoading(true);
            const productData = await api.getProductById(id);
            if (productData) {
                setProduct(productData);
                setMainImage(productData.images[0]);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            // Optionally, show a toast notification here
        }
    };
    
    const handleBuyNow = () => {
        if (product) {
            addToCart(product);
            navigate('/cart');
        }
    };

    if (loading) {
        return <div className="min-h-screen"><Spinner /></div>;
    }

    if (!product) {
        return <div className="text-center py-20">Product not found.</div>;
    }

    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div>
                        <div className="border dark:border-gray-700 rounded-lg mb-4 h-96 flex items-center justify-center">
                            <img src={mainImage} alt={product.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="flex space-x-2">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onMouseEnter={() => setMainImage(img)}
                                    className={`w-16 h-16 border-2 rounded-md overflow-hidden ${mainImage === img ? 'border-primary' : 'border-gray-200 dark:border-gray-600'}`}
                                >
                                    <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Product Details */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                        <div className="flex items-center my-3">
                            <StarRating rating={product.rating} />
                            <span className="text-gray-600 dark:text-gray-400 ml-3">{product.reviewCount} ratings</span>
                        </div>
                        <div className="my-4">
                             <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-500 line-through ml-3">₹{product.originalPrice.toLocaleString()}</span>
                            )}
                             {discount > 0 && <span className="text-green-600 dark:text-green-400 font-semibold ml-3">{discount}% off</span>}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{product.description}</p>
                        
                        <div className="border-t dark:border-gray-700 pt-4">
                            <h3 className="font-semibold mb-2">Key Features:</h3>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                                {product.features.map((feature, index) => <li key={index}>{feature}</li>)}
                            </ul>
                        </div>
                        
                        <div className="mt-auto pt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                             <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center py-3 px-6 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-md transition duration-300">
                                <ShoppingCart className="mr-2" /> ADD TO CART
                            </button>
                             <button onClick={handleBuyNow} className="flex-1 flex items-center justify-center py-3 px-6 bg-primary hover:bg-primary-dark text-white font-bold rounded-md transition duration-300">
                                <Zap className="mr-2" /> BUY NOW
                            </button>
                        </div>
                    </div>
                </div>
                 {/* Reviews Section - Mock */}
                 <div className="mt-12 border-t dark:border-gray-700 pt-8">
                    <h2 className="text-2xl font-bold mb-4">Ratings & Reviews</h2>
                    <div className="space-y-6">
                        <div className="border-b dark:border-gray-700 pb-4">
                            <div className="flex items-center mb-1">
                                <StarRating rating={5}/>
                                <p className="font-semibold ml-3">Absolutely amazing!</p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">The best product I've ever bought. Highly recommended.</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">John Doe, 2 weeks ago</p>
                        </div>
                         <div className="border-b dark:border-gray-700 pb-4">
                            <div className="flex items-center mb-1">
                                <StarRating rating={4}/>
                                <p className="font-semibold ml-3">Very good quality</p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Solid build, works as expected. Delivery was fast.</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Jane Smith, 1 month ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;

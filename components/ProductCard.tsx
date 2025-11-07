import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import StarRating from './StarRating';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return (
        <Link to={`/products/${product.id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
            <div className="relative overflow-hidden">
                 <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                 {discount > 0 && <div className="absolute top-2 left-2 bg-secondary text-gray-900 text-xs font-bold px-2 py-1 rounded">{discount}% off</div>}
            </div>
            <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</p>
                <h3 className="text-md font-semibold text-gray-800 dark:text-white truncate mt-1">{product.name}</h3>
                <div className="flex items-center mt-2">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({product.reviewCount})</span>
                </div>
                <div className="flex items-baseline mt-2">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</p>
                    {product.originalPrice && (
                        <p className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice.toLocaleString()}</p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import Spinner from '../components/Spinner';
import { Loader2 } from 'lucide-react';

const ProductEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        brand: '',
        category: '',
        stock: 0,
        images: [],
        features: [],
    });
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const isEditing = Boolean(id);

    useEffect(() => {
        if (id) {
            setPageLoading(true);
            api.getProductById(id).then(data => {
                if (data) {
                    setProduct(data);
                }
                setPageLoading(false);
            });
        } else {
            setPageLoading(false);
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!product.name || !product.price || !product.category || !product.brand) {
            alert('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            const productData = {
                ...product,
                price: Number(product.price),
                originalPrice: Number(product.originalPrice) || undefined,
                stock: Number(product.stock),
                // Ensure images and features are arrays of strings
                images: Array.isArray(product.images) 
                    ? product.images 
                    : String(product.images).split(',').map(s => s.trim()).filter(Boolean),
                features: Array.isArray(product.features)
                    ? product.features
                    : String(product.features).split(',').map(s => s.trim()).filter(Boolean),
            };

            if (isEditing) {
                await api.updateProduct(id!, productData as Product);
            } else {
                // Remove id, rating, reviewCount for creation
                const { id, rating, reviewCount, ...creationData } = productData;
                await api.createProduct(creationData as Omit<Product, 'id' | 'rating' | 'reviewCount'>);
            }
            navigate('/admin');
        } catch (error) {
            console.error("Failed to save product", error);
            alert("An error occurred while saving the product.");
        } finally {
            setLoading(false);
        }
    };
    
    if (pageLoading) {
        return <div className="min-h-screen"><Spinner /></div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Product' : 'Create New Product'}</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Product Name</label>
                        <input type="text" name="name" id="name" value={product.name} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                    </div>
                     <div>
                        <label htmlFor="brand" className="block text-sm font-medium mb-1">Brand</label>
                        <input type="text" name="brand" id="brand" value={product.brand} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                        <input type="text" name="category" id="category" value={product.category} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                    </div>
                     <div>
                        <label htmlFor="price" className="block text-sm font-medium mb-1">Price</label>
                        <input type="number" name="price" id="price" value={product.price} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                    </div>
                    <div>
                        <label htmlFor="originalPrice" className="block text-sm font-medium mb-1">Original Price (Optional)</label>
                        <input type="number" name="originalPrice" id="originalPrice" value={product.originalPrice || ''} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label htmlFor="stock" className="block text-sm font-medium mb-1">Stock</label>
                        <input type="number" name="stock" id="stock" value={product.stock} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" id="description" value={product.description} onChange={handleChange} rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="images" className="block text-sm font-medium mb-1">Images (comma-separated URLs)</label>
                        <input type="text" name="images" id="images" value={Array.isArray(product.images) ? product.images.join(', ') : ''} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="features" className="block text-sm font-medium mb-1">Features (comma-separated)</label>
                        <input type="text" name="features" id="features" value={Array.isArray(product.features) ? product.features.join(', ') : ''} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                        <button type="button" onClick={() => navigate('/admin')} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white font-bold rounded-md hover:bg-primary-dark transition flex items-center justify-center disabled:opacity-70">
                           {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditPage;

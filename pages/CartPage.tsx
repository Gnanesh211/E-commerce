
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage: React.FC = () => {
    const { cart, removeFromCart, updateCartQuantity, getCartTotal } = useAppContext();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    }

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="bg-primary text-white font-bold py-2 px-6 rounded-md hover:bg-primary-dark transition">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }
    
    const total = getCartTotal();
    const deliveryCharge = total > 500 ? 0 : 40;
    const finalTotal = total + deliveryCharge;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    {cart.map(item => (
                        <div key={item.product.id} className="flex flex-col sm:flex-row items-center justify-between border-b dark:border-gray-700 py-4 last:border-b-0">
                            <div className="flex items-center mb-4 sm:mb-0">
                                <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                                <div>
                                    <Link to={`/products/${item.product.id}`} className="font-semibold hover:text-primary">{item.product.name}</Link>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.product.brand}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center border dark:border-gray-600 rounded">
                                    <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-2">
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-4">{item.quantity}</span>
                                    <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-2">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <p className="font-semibold w-24 text-right">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                                <button onClick={() => removeFromCart(item.product.id)} className="text-gray-500 hover:text-red-500">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-24">
                        <h2 className="text-lg font-bold border-b dark:border-gray-700 pb-3 mb-4">Price Details</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Price ({cart.length} items)</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Discount</span>
                                <span className="text-green-600">- ₹0</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Delivery Charges</span>
                                <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : <span className="text-green-600">FREE</span>}</span>
                            </div>
                        </div>
                        <div className="border-t dark:border-gray-700 mt-4 pt-4 font-bold flex justify-between text-lg">
                            <span>Total Amount</span>
                            <span>₹{finalTotal.toLocaleString()}</span>
                        </div>
                        <button onClick={handleCheckout} className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary-dark transition">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

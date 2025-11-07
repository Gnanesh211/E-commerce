import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Loader2, CheckCircle } from 'lucide-react';

const OrderSuccessModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center w-full max-w-sm m-4">
                <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Thank you for your purchase. You can view your order details in your profile.
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary-dark transition"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};


const CheckoutPage: React.FC = () => {
    const { cart, getCartTotal, clearCart, user } = useAppContext();
    const navigate = useNavigate();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);

    if (!user) {
        navigate('/login?redirect=/checkout');
        return null;
    }
    
    if (cart.length === 0 && !isOrderSuccessModalOpen) {
        navigate('/');
        return null;
    }

    const total = getCartTotal();
    const deliveryCharge = total > 500 ? 0 : 40;
    const finalTotal = total + deliveryCharge;
    
    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || isPlacingOrder) return;

        setIsPlacingOrder(true);
        try {
            await api.createOrder(user.id, cart, finalTotal);
            setIsOrderSuccessModalOpen(true);
        } catch (error) {
            console.error('Failed to place order:', error);
            alert('An error occurred while placing your order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setIsOrderSuccessModalOpen(false);
        clearCart();
        navigate('/');
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold border-b dark:border-gray-700 pb-3 mb-4">1. Delivery Address</h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" defaultValue={user.name} />
                            <input type="tel" placeholder="Mobile Number" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Pincode" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Locality" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <textarea placeholder="Address (Area and Street)" required rows={3} className="md:col-span-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></textarea>
                            <input type="text" placeholder="City/District/Town" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="State" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Landmark (Optional)" className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" placeholder="Alternate Phone (Optional)" className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </form>

                        <h2 className="text-xl font-bold border-b dark:border-gray-700 pb-3 mt-8 mb-4">2. Payment Method</h2>
                         <div className="space-y-4">
                            <label className="flex items-center p-4 border rounded-lg cursor-pointer dark:border-gray-600">
                                <input type="radio" name="payment" className="form-radio text-primary" defaultChecked />
                                <span className="ml-4">Credit / Debit Card</span>
                            </label>
                            <label className="flex items-center p-4 border rounded-lg cursor-pointer dark:border-gray-600">
                                <input type="radio" name="payment" className="form-radio text-primary" />
                                <span className="ml-4">Net Banking</span>
                            </label>
                            <label className="flex items-center p-4 border rounded-lg cursor-pointer dark:border-gray-600">
                                <input type="radio" name="payment" className="form-radio text-primary" />
                                <span className="ml-4">Cash on Delivery</span>
                            </label>
                        </div>

                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-24">
                             <h2 className="text-lg font-bold border-b dark:border-gray-700 pb-3 mb-4">Order Summary</h2>
                             <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                 {cart.map(item => (
                                     <div key={item.product.id} className="flex justify-between items-start text-sm">
                                         <p className="w-2/3 truncate">{item.product.name} <span className="text-gray-500">x{item.quantity}</span></p>
                                         <p className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                                     </div>
                                 ))}
                             </div>
                            <div className="border-t dark:border-gray-700 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Delivery</span><span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : 'FREE'}</span></div>
                                <div className="font-bold flex justify-between text-lg"><span>Total</span><span>₹{finalTotal.toLocaleString()}</span></div>
                            </div>
                            <button onClick={handlePlaceOrder} disabled={isPlacingOrder} className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary-dark transition flex items-center justify-center disabled:opacity-70">
                                {isPlacingOrder ? (
                                    <><Loader2 className="animate-spin mr-2" size={20} /> Placing Order...</>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <OrderSuccessModal isOpen={isOrderSuccessModalOpen} onClose={handleCloseSuccessModal} />
        </>
    );
};

export default CheckoutPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { Order } from '../types';
import Spinner from '../components/Spinner';
import { Package, User, LogOut, X } from 'lucide-react';

const CancelOrderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string, feedback: string) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [feedback, setFeedback] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);

    const reasons = [
        "Ordered by mistake",
        "Item not required anymore",
        "Better price available",
        "Delivery address is incorrect",
        "Expected delivery time is too long",
        "Other"
    ];

    const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedReason = e.target.value;
        setReason(selectedReason);
        setShowFeedback(selectedReason === "Other");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!reason) {
            alert("Please select a reason for cancellation.");
            return;
        }
        onSubmit(reason, feedback);
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Cancel Order</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Please let us know why you're cancelling this order.</p>
                    <div className="space-y-2">
                        {reasons.map(r => (
                            <label key={r} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                <input 
                                    type="radio" 
                                    name="reason" 
                                    value={r} 
                                    checked={reason === r}
                                    onChange={handleReasonChange} 
                                    className="form-radio text-primary"
                                />
                                <span>{r}</span>
                            </label>
                        ))}
                    </div>
                    {showFeedback && (
                        <div className="mt-4">
                            <label htmlFor="feedback" className="block text-sm font-medium mb-1">Please provide more details:</label>
                            <textarea 
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={3}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            ></textarea>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Keep Order</button>
                        <button type="submit" className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700">Confirm Cancellation</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ProfilePage: React.FC = () => {
    const { user, logout } = useAppContext();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);


    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setLoading(true);
            api.getOrders(user.id).then(data => {
                setOrders(data);
                setLoading(false);
            });
        }
    }, [user, navigate]);
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleOpenCancelModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const handleCloseCancelModal = () => {
        setSelectedOrderId(null);
        setIsModalOpen(false);
    };
    
    const handleConfirmCancellation = async (reason: string, feedback: string) => {
        if (!selectedOrderId) return;
        
        try {
            const updatedOrder = await api.cancelOrder(selectedOrderId, reason, feedback);
            setOrders(prevOrders => prevOrders.map(o => o.id === selectedOrderId ? updatedOrder : o));
        } catch (error) {
            console.error("Failed to cancel order:", error);
            alert("There was an error cancelling your order. Please try again.");
        } finally {
            handleCloseCancelModal();
        }
    };


    if (loading) {
        return <div className="min-h-screen"><Spinner /></div>
    }

    if (!user) return null;

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Delivered': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
            case 'Shipped': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
            case 'Pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Account</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4 mb-4">
                             <div className="w-16 h-16 bg-primary text-white flex items-center justify-center rounded-full text-2xl font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <nav className="space-y-2">
                             <button onClick={() => setActiveTab('orders')} className={`w-full text-left flex items-center space-x-3 p-2 rounded-md ${activeTab === 'orders' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <Package size={20} /><span>My Orders</span>
                            </button>
                             <button onClick={() => setActiveTab('profile')} className={`w-full text-left flex items-center space-x-3 p-2 rounded-md ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <User size={20} /><span>Profile Information</span>
                            </button>
                            <button onClick={handleLogout} className="w-full text-left flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                <LogOut size={20} /><span>Logout</span>
                            </button>
                        </nav>
                    </div>
                </div>
                <div className="md:col-span-3">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-h-[300px]">
                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Order History</h2>
                                {orders.length > 0 ? (
                                    <div className="space-y-6">
                                        {orders.map(order => (
                                            <div key={order.id} className="border dark:border-gray-700 rounded-lg p-4">
                                                <div className="flex flex-wrap justify-between items-start border-b dark:border-gray-700 pb-2 mb-2">
                                                    <div>
                                                        <p className="font-semibold">Order ID: {order.id}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date: {order.date}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <p className="font-semibold">Total: ₹{order.total.toLocaleString()}</p>
                                                        <p className={`text-sm font-semibold text-right px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>{order.status}</p>
                                                    </div>
                                                </div>
                                                {order.items.map(item => (
                                                    <div key={item.product.id} className="flex items-center my-2">
                                                        <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded mr-4" />
                                                        <div>
                                                            <p className="font-semibold">{item.product.name}</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(order.status === 'Pending' || order.status === 'Shipped') && (
                                                    <div className="flex justify-end mt-2">
                                                        <button 
                                                            onClick={() => handleOpenCancelModal(order.id)}
                                                            className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm font-semibold rounded-md hover:bg-red-200 dark:hover:bg-red-800"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>You have not placed any orders yet.</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Profile Information</h2>
                                <p>Feature coming soon. Here you would be able to edit your name, email, and password.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <CancelOrderModal
                isOpen={isModalOpen}
                onClose={handleCloseCancelModal}
                onSubmit={handleConfirmCancellation}
            />
        </div>
    );
};

export default ProfilePage;
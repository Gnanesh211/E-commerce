import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { authService } from '../services/auth';
import { Order, User, Product } from '../types';
import { useAppContext } from '../context/AppContext';
import Spinner from '../components/Spinner';
import { Users, Package, DollarSign, ShoppingCart, Edit, Trash2, PlusCircle, XCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const AdminPage: React.FC = () => {
    const { user: currentUser } = useAppContext();
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('customers');
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [usersData, ordersData, productsData] = await Promise.all([
                api.getAllUsers(),
                api.getAllOrders(),
                api.getProducts()
            ]);
            setUsers(usersData);
            setOrders(ordersData);
            setProducts(productsData);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRoleChange = async (userId: string, newRole: 'Admin' | 'Customer') => {
        const action = newRole === 'Admin' ? 'promote' : 'demote';
        const roleName = newRole;
        if (window.confirm(`Are you sure you want to ${action} this user to ${roleName}?`)) {
            try {
                const updatedUser = await authService.updateUserRole(userId, newRole);
                setUsers(currentUsers =>
                    currentUsers.map(user =>
                        user.id === userId ? updatedUser : user
                    )
                );
            } catch (error) {
                console.error(`Failed to ${action} user:`, error);
                alert(`Could not ${action} user: ${error instanceof Error ? error.message : 'Please try again.'}`);
            }
        }
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (window.confirm(`Are you sure you want to permanently delete the user "${userName}"? This action cannot be undone.`)) {
            try {
                await authService.deleteUser(userId);
                setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
            } catch (error) {
                console.error(`Failed to delete user:`, error);
                alert(`Could not delete user: ${error instanceof Error ? error.message : 'Please try again.'}`);
            }
        }
    };

    const deliveredOrders = orders.filter(o => o.status === 'Delivered');
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalCustomers = users.filter(u => u.role === 'Customer').length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled');


    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Delivered': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
            case 'Shipped': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
            case 'Pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
        }
    }
    
    const getRoleColor = (role: User['role']) => {
        switch (role) {
            case 'Chairman': return 'text-purple-800 bg-purple-100 dark:text-purple-200 dark:bg-purple-900';
            case 'Admin': return 'text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900';
            case 'Customer': return 'text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-gray-700';
        }
    }


    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.deleteProduct(productId);
                setProducts(currentProducts => currentProducts.filter(p => p.id !== productId));
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Could not delete product. Please try again.");
            }
        }
    };


    const CustomersTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        {currentUser?.role === 'Chairman' && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                    {user.role}
                                </span>
                            </td>
                            {currentUser?.role === 'Chairman' && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.id !== currentUser.id && user.role !== 'Chairman' && (
                                         <div className="flex items-center space-x-4">
                                            {user.role === 'Customer' && <button onClick={() => handleRoleChange(user.id, 'Admin')} className="flex items-center text-sm text-green-600 hover:text-green-800" title="Make Admin"><ArrowUpCircle size={18} /> <span className="ml-1">Make Admin</span></button>}
                                            {user.role === 'Admin' && <button onClick={() => handleRoleChange(user.id, 'Customer')} className="flex items-center text-sm text-yellow-600 hover:text-yellow-800" title="Make Customer"><ArrowDownCircle size={18} /> <span className="ml-1">Make Customer</span></button>}
                                            <button onClick={() => handleDeleteUser(user.id, user.name)} className="flex items-center text-sm text-red-600 hover:text-red-800" title="Delete User"><Trash2 size={18} /> <span className="ml-1">Delete</span></button>
                                        </div>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const OrdersTable = () => (
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order.userId}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">₹{order.total.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const ProductsTable = () => (
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt={product.name} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                                        <div className="text-sm text-gray-500">{product.brand}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">₹{product.price.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => navigate(`/admin/product/edit/${product.id}`)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    const CancellationsTable = () => (
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {cancelledOrders.map((order) => (
                        <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order.userId}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{order.cancellationReason}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.cancellationFeedback || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderActiveTab = () => {
        switch(activeTab) {
            case 'customers': return <CustomersTable />;
            case 'orders': return <OrdersTable />;
            case 'products': return <ProductsTable />;
            case 'cancellations': return <CancellationsTable />;
            default: return null;
        }
    }


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4"><DollarSign size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4"><ShoppingCart size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                                <p className="text-2xl font-bold">{totalOrders}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 mr-4"><Users size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
                                <p className="text-2xl font-bold">{totalCustomers}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 mr-4"><XCircle size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Cancelled Orders</p>
                                <p className="text-2xl font-bold">{cancelledOrders.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="border-b border-gray-200 dark:border-gray-700 mb-4 flex justify-between items-center">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button onClick={() => setActiveTab('customers')} className={`${activeTab === 'customers' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                    Customers
                                </button>
                                <button onClick={() => setActiveTab('orders')} className={`${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                    All Orders
                                </button>
                                <button onClick={() => setActiveTab('products')} className={`${activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                    Products
                                </button>
                                <button onClick={() => setActiveTab('cancellations')} className={`${activeTab === 'cancellations' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                    Cancellations
                                </button>
                            </nav>
                             {activeTab === 'products' && (
                                <Link to="/admin/product/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-dark transition">
                                    <PlusCircle size={18} />
                                    Create New Product
                                </Link>
                            )}
                        </div>
                        {renderActiveTab()}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminPage;
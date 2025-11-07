import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/auth';
import { Loader2, ShieldCheck } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
    const { login } = useAppContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const user = await authService.login(email, password);
            if (user.role !== 'Admin' && user.role !== 'Chairman') {
                throw new Error('You do not have administrative privileges.');
            }
            login(user);
            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg m-4">
                <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
                <h1 className="text-3xl font-bold text-center text-primary mt-2 mb-2">Admin Portal</h1>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Please sign in to continue</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>
                     <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <button 
                        type="submit" 
                        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition duration-300 flex items-center justify-center disabled:bg-gray-400 dark:disabled:bg-gray-600"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="animate-spin mr-2" size={20} />}
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
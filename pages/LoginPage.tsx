import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/auth';
import { Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login } = useAppContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            let user;
            let redirectPath;

            if (isLogin) {
                user = await authService.login(email, password);
                redirectPath = searchParams.get('redirect') || '/profile';
            } else {
                if (name.trim() === '') {
                    throw new Error('Full Name is required.');
                }
                user = await authService.signup(name, email, password);
                redirectPath = '/'; // New users go to the homepage
            }
            
            login(user);
            navigate(redirectPath);

        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const toggleFormType = () => {
        setIsLogin(!isLogin);
        setError(null);
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg m-4">
                <h1 className="text-3xl font-bold text-center text-primary mb-2">{isLogin ? 'Login' : 'Sign Up'}</h1>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Welcome to ShopLux</p>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                         <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="h-6 mb-4 flex justify-end items-center">
                         {isLogin && (
                            <Link to="/forgot-password" className="text-sm text-primary font-semibold hover:underline">
                                Forgot Password?
                            </Link>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <button 
                        type="submit" 
                        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition duration-300 flex items-center justify-center disabled:bg-gray-400 dark:disabled:bg-gray-600"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="animate-spin mr-2" size={20} />}
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                </form>
                <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={toggleFormType} className="text-primary font-semibold ml-1 hover:underline">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
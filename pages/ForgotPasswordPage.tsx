
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would call an API to send the reset link
        alert('If an account with that email exists, a password reset link has been sent.');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg m-4">
                <h1 className="text-3xl font-bold text-center text-primary mb-2">Forgot Password</h1>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Enter your email to receive a reset link.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition duration-300">
                        Send Reset Link
                    </button>
                </form>
                <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                    Remember your password?
                    <Link to="/login" className="text-primary font-semibold ml-1 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

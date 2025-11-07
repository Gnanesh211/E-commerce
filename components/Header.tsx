import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, Sun, Moon, Search, Menu, X, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';

const Header: React.FC = () => {
    const { theme, toggleTheme, user, cart } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<{ id: string, name: string }[]>([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm) {
                api.searchSuggestions(searchTerm).then(setSuggestions);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSuggestionsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if(searchTerm.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
            setIsSuggestionsVisible(false);
            setSearchTerm('');
        }
    };

    const hasAdminAccess = user?.role === 'Admin' || user?.role === 'Chairman';

    return (
        <header className="bg-primary text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-2xl font-bold">
                        ShopLux
                    </Link>
                </div>

                <div className="hidden md:flex flex-grow max-w-2xl mx-4" ref={searchRef}>
                    <form onSubmit={handleSearch} className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search for products, brands and more"
                            className="w-full px-4 py-2 text-gray-800 rounded-l-md focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSuggestionsVisible(true)}
                        />
                        <button type="submit" className="absolute right-0 top-0 h-full bg-white px-4 text-primary rounded-r-md">
                            <Search size={20} />
                        </button>
                        {isSuggestionsVisible && suggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-b-md shadow-lg max-h-80 overflow-y-auto">
                                {suggestions.map(s => (
                                    <li key={s.id} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                        onClick={() => {
                                            navigate(`/products/${s.id}`);
                                            setIsSuggestionsVisible(false);
                                            setSearchTerm('');
                                        }}>
                                        {s.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>
                </div>
                
                <div className="flex items-center space-x-4 md:space-x-6">
                     <nav className="hidden md:flex items-center space-x-6">
                        {hasAdminAccess && (
                            <Link to="/admin" className="flex items-center space-x-1 hover:text-gray-200">
                                <ShieldCheck size={22} />
                                <span>Admin</span>
                            </Link>
                        )}
                        <Link to={user ? "/profile" : "/login"} className="flex items-center space-x-1 hover:text-gray-200">
                            <UserIcon size={22} />
                            <span>{user ? user.name.split(' ')[0] : 'Login'}</span>
                        </Link>
                        <Link to="/cart" className="flex items-center space-x-1 hover:text-gray-200 relative">
                            <ShoppingCart size={22} />
                            <span>Cart</span>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                            )}
                        </Link>
                    </nav>
                     <button onClick={toggleTheme} className="focus:outline-none hover:text-gray-200">
                        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                    </button>
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {isMobileMenuOpen && (
                 <div className="md:hidden bg-primary dark:bg-gray-800 p-4 space-y-4">
                    <form onSubmit={handleSearch} className="relative w-full">
                         <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-4 py-2 text-gray-800 rounded-md focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                         <button type="submit" className="absolute right-0 top-0 h-full px-4 text-primary">
                            <Search size={20} />
                        </button>
                    </form>
                    <nav className="flex flex-col space-y-3">
                        {hasAdminAccess && (
                            <Link to="/admin" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                                <ShieldCheck size={22} />
                                <span>Admin</span>
                            </Link>
                        )}
                        <Link to={user ? "/profile" : "/login"} className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <UserIcon size={22} />
                            <span>{user ? user.name.split(' ')[0] : 'Login'}</span>
                        </Link>
                        <Link to="/cart" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <ShoppingCart size={22} />
                            <span>Cart</span>
                             {cartItemCount > 0 && (
                                <span className="bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                            )}
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
import { Product, Category, Order, CartItem, User } from '../types';
import { authService } from './auth';

const PRODUCTS_KEY = 'shoplux_products';
const CATEGORIES_KEY = 'shoplux_categories';
const ORDERS_KEY = 'shoplux_orders';

// --- Seed Data (only used if localStorage is empty) ---
const seedProducts: Product[] = [
  {
    id: '1',
    name: 'Apple iPhone 15 Pro Max',
    description: 'A magical new way to interact with iPhone. Groundbreaking safety features designed to save lives. An innovative 48MP camera for mind-blowing detail. All powered by the ultimate smartphone chip.',
    price: 139900,
    originalPrice: 149900,
    rating: 4.7,
    reviewCount: 1850,
    brand: 'Apple',
    category: 'Mobiles',
    images: ['https://picsum.photos/id/1/800/800', 'https://picsum.photos/id/2/800/800', 'https://picsum.photos/id/3/800/800'],
    stock: 50,
    features: ['256GB Storage', 'A17 Bionic Chip', 'Super Retina XDR Display', 'Titanium Design'],
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Our best ever noise cancelling just got better. See how these Sony noise cancelling headphones combine our best ever noise cancelling technology with superlative sound for a truly remarkable listening experience.',
    price: 29990,
    originalPrice: 34990,
    rating: 4.8,
    reviewCount: 980,
    brand: 'Sony',
    category: 'Electronics',
    images: ['https://picsum.photos/id/10/800/800', 'https://picsum.photos/id/11/800/800', 'https://picsum.photos/id/12/800/800'],
    stock: 120,
    features: ['Industry-leading Noise Cancellation', '30-hour battery life', 'Multi-point connection', 'Crystal clear hands-free calling'],
  },
  {
    id: '3',
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 is the first-ever Air Max created specifically for lifestyle, with the biggest-ever Air unit in the heel for a supersoft ride that feels as impossible as it looks.',
    price: 12995,
    rating: 4.5,
    reviewCount: 2300,
    brand: 'Nike',
    category: 'Fashion',
    images: ['https://picsum.photos/id/20/800/800', 'https://picsum.photos/id/21/800/800', 'https://picsum.photos/id/22/800/800'],
    stock: 200,
    features: ['Large volume Max Air unit', 'Knit upper with no-sew overlays', 'Asymmetrical lacing', 'Heel pull tab'],
  },
  {
    id: '4',
    name: 'Samsung 55" QLED 4K Smart TV',
    description: 'A billion shades of color with Quantum Dot. Witness the difference with a fine-tuned spectrum of colors.',
    price: 79999,
    originalPrice: 99999,
    rating: 4.6,
    reviewCount: 1500,
    brand: 'Samsung',
    category: 'Appliances',
    images: ['https://picsum.photos/id/30/800/800', 'https://picsum.photos/id/31/800/800', 'https://picsum.photos/id/32/800/800'],
    stock: 30,
    features: ['Quantum Processor 4K', 'Dual LED Backlight', 'Quantum HDR', 'Motion Xcelerator Turbo+'],
  },
  {
    id: '5',
    name: 'The Alchemist by Paulo Coelho',
    description: 'Paulo Coelho\'s masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.',
    price: 349,
    originalPrice: 499,
    rating: 4.9,
    reviewCount: 10500,
    brand: 'Penguin',
    category: 'Books',
    images: ['https://picsum.photos/id/40/800/800', 'https://picsum.photos/id/41/800/800'],
    stock: 500,
    features: ['Paperback', '208 pages', 'English', 'Fiction'],
  },
  {
    id: '6',
    name: 'Wooden Study Table',
    description: 'A modern and sturdy study table, perfect for your home office or student room. Made with high-quality engineered wood.',
    price: 4999,
    rating: 4.2,
    reviewCount: 450,
    brand: 'Urban Ladder',
    category: 'Home',
    images: ['https://picsum.photos/id/50/800/800', 'https://picsum.photos/id/51/800/800', 'https://picsum.photos/id/52/800/800'],
    stock: 80,
    features: ['Engineered Wood', 'Wenge Finish', '1 Drawer, 1 Cabinet', 'DIY Assembly'],
  },
  {
    id: '7',
    name: 'American Tourister Suitcase',
    description: 'Durable and spacious suitcase for all your travel needs. Comes with a TSA lock and 360-degree rotating wheels.',
    price: 3599,
    originalPrice: 5000,
    rating: 4.4,
    reviewCount: 1200,
    brand: 'American Tourister',
    category: 'Travel',
    images: ['https://picsum.photos/id/60/800/800', 'https://picsum.photos/id/61/800/800'],
    stock: 150,
    features: ['Polycarbonate', '55 cm Cabin Size', 'TSA Lock', '4 Wheels'],
  },
  {
    id: '8',
    name: 'LEGO Classic Large Creative Brick Box',
    description: 'This big box of classic LEGO bricks in 33 different colors will inspire imaginative building for kids and adults.',
    price: 2899,
    rating: 4.9,
    reviewCount: 3200,
    brand: 'LEGO',
    category: 'Toys',
    images: ['https://picsum.photos/id/70/800/800', 'https://picsum.photos/id/71/800/800'],
    stock: 250,
    features: ['790 Pieces', 'Ages 4+', 'Includes windows, doors, wheels', 'Storage box included'],
  }
];

const seedCategories: Category[] = [
    { id: '1', name: 'Mobiles', imageUrl: 'https://picsum.photos/id/101/200/200' },
    { id: '2', name: 'Electronics', imageUrl: 'https://picsum.photos/id/102/200/200' },
    { id: '3', name: 'Fashion', imageUrl: 'https://picsum.photos/id/103/200/200' },
    { id: '4', name: 'Appliances', imageUrl: 'https://picsum.photos/id/104/200/200' },
    { id: '5', name: 'Books', imageUrl: 'https://picsum.photos/id/105/200/200' },
    { id: '6', name: 'Home', imageUrl: 'https://picsum.photos/id/106/200/200' },
    { id: '7', name: 'Travel', imageUrl: 'https://picsum.photos/id/107/200/200' },
    { id: '8', name: 'Toys', imageUrl: 'https://picsum.photos/id/108/200/200' },
];

// --- Database Initialization ---
const initDatabase = () => {
    if (!localStorage.getItem(PRODUCTS_KEY)) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seedProducts));
    }
    if (!localStorage.getItem(CATEGORIES_KEY)) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(seedCategories));
    }
    if (!localStorage.getItem(ORDERS_KEY)) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
    }
};

initDatabase();

// --- Helper Functions ---
const mockAsync = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data);
        }, 300 + Math.random() * 400);
    });
};

const readFromDb = <T,>(key: string): T => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error(`Failed to parse ${key} from localStorage`, e);
        return [] as T;
    }
};

const writeToDb = <T,>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// --- API Service ---
export const api = {
    getProducts: (query?: string, filters?: any): Promise<Product[]> => {
        let products = readFromDb<Product[]>(PRODUCTS_KEY);
        if (query) {
            products = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        }
        return mockAsync(products);
    },

    getProductById: (id: string): Promise<Product | undefined> => {
        const products = readFromDb<Product[]>(PRODUCTS_KEY);
        const product = products.find(p => p.id === id);
        return mockAsync(product);
    },

    getCategories: (): Promise<Category[]> => {
        const categories = readFromDb<Category[]>(CATEGORIES_KEY);
        return mockAsync(categories);
    },
    
    getTrendingProducts: (): Promise<Product[]> => {
        const products = readFromDb<Product[]>(PRODUCTS_KEY);
        return mockAsync(products.slice(0, 4));
    },

    getOrders: (userId: string): Promise<Order[]> => {
        const allOrders = readFromDb<Order[]>(ORDERS_KEY);
        const userOrders = allOrders.filter(o => o.userId === userId);
        return mockAsync(userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    },

    createOrder: (userId: string, items: CartItem[], total: number): Promise<Order> => {
        const allOrders = readFromDb<Order[]>(ORDERS_KEY);
        const newOrder: Order = {
            id: `ORD${Date.now()}`,
            userId: userId,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            total,
            items
        };
        allOrders.push(newOrder);
        writeToDb(ORDERS_KEY, allOrders);
        return mockAsync(newOrder);
    },
    
    cancelOrder: (orderId: string, reason: string, feedback?: string): Promise<Order> => {
        const allOrders = readFromDb<Order[]>(ORDERS_KEY);
        let cancelledOrder: Order | undefined;
        const updatedOrders = allOrders.map(order => {
            if (order.id === orderId) {
                cancelledOrder = {
                    ...order,
                    status: 'Cancelled',
                    cancellationReason: reason,
                    cancellationFeedback: feedback,
                };
                return cancelledOrder;
            }
            return order;
        });
        
        if (!cancelledOrder) {
            return Promise.reject(new Error("Order not found"));
        }

        writeToDb(ORDERS_KEY, updatedOrders);
        return mockAsync(cancelledOrder);
    },

    searchSuggestions: (query: string): Promise<{id: string, name: string}[]> => {
        if (!query) return Promise.resolve([]);
        const products = readFromDb<Product[]>(PRODUCTS_KEY);
        const suggestions = products
            .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
            .map(p => ({ id: p.id, name: p.name }));
        return mockAsync(suggestions.slice(0, 5));
    },
    
    // --- Admin Functions ---
    getAllOrders: (): Promise<Order[]> => {
        const allOrders = readFromDb<Order[]>(ORDERS_KEY);
        return mockAsync(allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    },

    getAllUsers: (): Promise<User[]> => {
        return authService.getAllUsers();
    },

    createProduct: (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Promise<Product> => {
        const products = readFromDb<Product[]>(PRODUCTS_KEY);
        const newProduct: Product = {
            ...productData,
            id: `prod_${Date.now()}`,
            rating: 0, // Default values for new products
            reviewCount: 0,
        };
        products.push(newProduct);
        writeToDb(PRODUCTS_KEY, products);
        return mockAsync(newProduct);
    },

    updateProduct: (productId: string, updatedData: Product): Promise<Product> => {
        let products = readFromDb<Product[]>(PRODUCTS_KEY);
        products = products.map(p => (p.id === productId ? updatedData : p));
        writeToDb(PRODUCTS_KEY, products);
        return mockAsync(updatedData);
    },

    deleteProduct: (productId: string): Promise<{ success: true }> => {
        let products = readFromDb<Product[]>(PRODUCTS_KEY);
        products = products.filter(p => p.id !== productId);
        writeToDb(PRODUCTS_KEY, products);
        return mockAsync({ success: true });
    },
};
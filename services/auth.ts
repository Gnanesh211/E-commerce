import { User } from '../types';

// This is a mock user service that uses localStorage to simulate a user database.
// In a real application, this would make API calls to a backend server.

const USERS_KEY = 'shoplux_users';

type StoredUser = User & { password: string };

const initSystemUsers = () => {
    const users = getUsers();
    
    // Ensure Chairman exists
    const chairmanExists = users.some(u => u.email === 'Chairaman@ShopLux.com');
    if (!chairmanExists) {
        users.push({
            id: 'chairman_user_01',
            name: 'Chairman',
            email: 'Chairaman@ShopLux.com',
            password: 'Karshvarth211', // Use a strong, hashed password in a real app!
            role: 'Chairman',
        });
    }

    // Ensure a default Admin exists
    const adminExists = users.some(u => u.email === 'admin@shoplux.com');
    if (!adminExists) {
        users.push({
            id: 'admin_user_01',
            name: 'Admin',
            email: 'admin@shoplux.com',
            password: 'admin123', // Use a strong, hashed password in a real app!
            role: 'Admin',
        });
    }
    
    saveUsers(users);
};

const getUsers = (): StoredUser[] => {
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    } catch (e) {
        console.error("Failed to parse users from localStorage", e);
        return [];
    }
};

const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Initialize system users on load
initSystemUsers();


export const authService = {
    signup: async (name: string, email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();
                const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
                if (existingUser) {
                    reject(new Error('User with this email already exists.'));
                    return;
                }
                const newUser: StoredUser = {
                    id: Date.now().toString(),
                    name,
                    email,
                    password, // In a real app, you should hash this password!
                    role: 'Customer',
                };
                users.push(newUser);
                saveUsers(users);
                const { password: _, ...userToReturn } = newUser;
                resolve(userToReturn);
            }, 500);
        });
    },

    login: async (email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) => {
             setTimeout(() => {
                const users = getUsers();
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
                if (!user || user.password !== password) {
                    reject(new Error('Invalid email or password.'));
                    return;
                }
                const { password: _, ...userToReturn } = user;
                resolve(userToReturn);
            }, 500);
        });
    },
    
    getAllUsers: (): Promise<User[]> => {
        return new Promise((resolve) => {
            const users = getUsers();
            const usersToReturn = users.map(u => {
                const { password, ...user } = u;
                return user;
            });
            resolve(usersToReturn);
        });
    },

    updateUserRole: (userId: string, newRole: 'Admin' | 'Customer'): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();
                const userIndex = users.findIndex(u => u.id === userId);

                if (userIndex === -1) {
                    return reject(new Error('User not found'));
                }

                const userToUpdate = users[userIndex];
                if (userToUpdate.role === 'Chairman') {
                    return reject(new Error("Cannot change the Chairman's role."));
                }
                
                if (userToUpdate.role === newRole) {
                    return reject(new Error(`User is already a ${newRole}.`));
                }

                userToUpdate.role = newRole;
                saveUsers(users);
                const { password, ...updatedUser } = userToUpdate;
                resolve(updatedUser);
            }, 500);
        });
    },

    deleteUser: (userId: string): Promise<{ success: true }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();
                const userToDelete = users.find(u => u.id === userId);

                if (!userToDelete) {
                    return reject(new Error('User not found'));
                }

                if (userToDelete.role === 'Chairman') {
                    return reject(new Error("Cannot delete the Chairman account."));
                }
                
                const updatedUsers = users.filter(u => u.id !== userId);
                saveUsers(updatedUsers);
                resolve({ success: true });
            }, 500);
        });
    }
};
import Cookies from 'js-cookie';

// Cookie settings
const COOKIE_OPTIONS = {
    expires: 1, // 1 day (matches JWT expiration)
    sameSite: 'lax' as const,
    secure: import.meta.env.PROD, // Only use secure cookies in production (HTTPS)
};

// Auth cookie management
export const auth = {
    // Save authentication data
    setAuth: (token: string, user: any) => {
        Cookies.set('token', token, COOKIE_OPTIONS);
        Cookies.set('user', JSON.stringify(user), COOKIE_OPTIONS);
    },

    // Get token
    getToken: (): string | undefined => {
        return Cookies.get('token');
    },

    // Get user data
    getUser: (): any | null => {
        const userStr = Cookies.get('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Failed to parse user data from cookie:', error);
            return null;
        }
    },

    // Check if authenticated
    isAuthenticated: (): boolean => {
        const token = Cookies.get('token');
        const userStr = Cookies.get('user');

        if (!token || !userStr) return false;

        try {
            const user = JSON.parse(userStr);
            return !!(user && user.id);
        } catch (error) {
            return false;
        }
    },

    // Clear authentication
    clearAuth: () => {
        Cookies.remove('token');
        Cookies.remove('user');
        // Also clear any old localStorage data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

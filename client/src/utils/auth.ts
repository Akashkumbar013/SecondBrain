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
        // Check if user has consented to cookies
        const consent = localStorage.getItem('cookieConsent');

        if (consent === 'accepted') {
            Cookies.set('token', token, COOKIE_OPTIONS);
            Cookies.set('user', JSON.stringify(user), COOKIE_OPTIONS);
        } else if (consent === 'declined') {
            // User declined cookies - show message or handle appropriately
            console.warn('Cannot save authentication: User declined cookies');
            alert('You need to accept cookies to stay logged in. Please refresh and accept cookies to use this feature.');
        } else {
            // No consent yet - wait for user to accept
            console.warn('Waiting for cookie consent');
        }
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

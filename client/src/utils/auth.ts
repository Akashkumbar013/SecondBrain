import Cookies from 'js-cookie';

// Cookie settings - optimized for maximum persistence
const COOKIE_OPTIONS = {
    expires: 7, // 7 days for better persistence
    path: '/', // Available across entire domain
    sameSite: 'lax' as const, // Lax for better compatibility
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

            // Also store in localStorage as backup
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            console.log('✅ Auth data saved to cookies and localStorage');
        } else if (consent === 'declined') {
            console.warn('Cannot save authentication: User declined cookies');
            alert('You need to accept cookies to stay logged in. Please refresh and accept cookies to use this feature.');
        } else {
            console.warn('Waiting for cookie consent');
        }
    },

    // Get token - check both cookies and localStorage
    getToken: (): string | undefined => {
        let token = Cookies.get('token');
        if (!token) {
            // Fallback to localStorage
            token = localStorage.getItem('token') || undefined;
        }
        return token;
    },

    // Get user data - check both cookies and localStorage
    getUser: (): any | null => {
        let userStr = Cookies.get('user');
        if (!userStr) {
            // Fallback to localStorage
            userStr = localStorage.getItem('user');
        }

        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Failed to parse user data:', error);
            return null;
        }
    },

    // Check if authenticated
    isAuthenticated: (): boolean => {
        const token = auth.getToken();
        const user = auth.getUser();

        if (!token || !user) {
            console.log('❌ Not authenticated - missing token or user');
            return false;
        }

        if (!user.id) {
            console.log('❌ Not authenticated - invalid user data');
            return false;
        }

        console.log('✅ User is authenticated:', user.email);
        return true;
    },

    // Clear authentication
    clearAuth: () => {
        Cookies.remove('token', { path: '/' });
        Cookies.remove('user', { path: '/' });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('🗑️ Auth data cleared');
    },
};

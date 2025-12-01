import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { AuthModal } from '../components/AuthModal';

export function Login() {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        }
    }, [user, isAdmin, navigate]);

    // We can reuse the AuthModal but force it to be open and in login mode
    // Or we can extract the form. For now, let's reuse the modal style but embedded.
    // Actually, the AuthModal is designed as a modal. 
    // A better approach for a "page" is to render the AuthModal with isOpen={true} and onClose redirecting to home.

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <AuthModal
                onClose={() => navigate('/')}
                initialMode="login"
            />
        </div>
    );
}

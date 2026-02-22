import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authAPI } from '../utils/api';
import zanizaLogo from '../assets/zaniza-logo.png';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); // Need this import

    useEffect(() => {
        // Check for Google Auth token in URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const role = params.get('role');
        const userName = params.get('name');
        const userEmail = params.get('email');
        const userImage = params.get('image');

        if (token) {
            // Store token
            localStorage.setItem('token', token);
            localStorage.setItem('isAuthenticated', 'true');
            // Store full user object
            const userObj = { role: role || 'customer', name: userName || 'User', email: userEmail || '', image: userImage || null };
            localStorage.setItem('user', JSON.stringify(userObj));

            // Notify Navbar to update
            window.dispatchEvent(new Event('auth-change'));

            // Redirect
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [location, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login({ email, password });

            // Store token and user info
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('isAuthenticated', 'true');

            // Notify Navbar to update
            window.dispatchEvent(new Event('auth-change'));

            // Redirect based on role
            if (response.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !phone) {
            setError('All fields are required');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.register({ name, email, password, phone });

            // Store token and user info
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('isAuthenticated', 'true');

            // Notify Navbar to update
            window.dispatchEvent(new Event('auth-change'));

            // Customer always goes to home page
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registration failed. Email might already exist.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Redirect to backend Google Auth endpoint
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api');
        // Handle potential double slashes if API_URL ends with /
        const separator = API_URL.endsWith('/') ? '' : '/';
        window.location.href = `${API_URL}${separator}auth/google`;
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-logo-wrap">
                    <img src={zanizaLogo} alt="Zaniza" className="login-logo-img" />
                </div>
                <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
                <p className="subtitle">Zaniza</p>

                {error && <div className="error-message">{error}</div>}

                {/* Google Login Button */}
                <button
                    type="button"
                    className="google-login-btn"
                    onClick={handleGoogleLogin}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    <span>Continue with Google</span>
                </button>

                <div className="divider">
                    <span>OR</span>
                </div>

                {isRegister ? (
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="At least 6 characters"
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <p className="mt-4 text-sm text-center text-gray">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegister(false);
                                    setError('');
                                }}
                                className="link-btn"
                            >
                                Login
                            </button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <p className="mt-4 text-sm text-center text-gray">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegister(true);
                                    setError('');
                                }}
                                className="link-btn"
                            >
                                Create Account
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productAPI } from '../utils/api';
import zanizaLogo from '../assets/zaniza-logo.png';
import './Navbar.css';

const Navbar = () => {
    const { cartCount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const searchRef = useRef(null);
    const profileRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Load all products for search
    useEffect(() => {
        productAPI.getAll()
            .then(data => setAllProducts(data))
            .catch(err => console.error(err));
    }, []);

    // Load user from localStorage and listen for changes
    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user", e);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        loadUser();

        // Listen for custom auth event and storage events
        window.addEventListener('auth-change', loadUser);
        window.addEventListener('storage', loadUser);

        return () => {
            window.removeEventListener('auth-change', loadUser);
            window.removeEventListener('storage', loadUser);
        };
    }, []);

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = allProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        setSearchResults(filtered.slice(0, 5)); // Show max 5 results
    }, [searchQuery, allProducts]);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
                setSearchQuery('');
            }
        };

        if (searchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Focus input when search opens
            setTimeout(() => inputRef.current?.focus(), 100);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchOpen]);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };

        if (profileDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileDropdownOpen]);

    // Close mobile menu on location change
    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const handleSearchClick = () => {
        setSearchOpen(!searchOpen);
        if (!searchOpen) {
            setSearchQuery('');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleResultClick = (productId) => {
        navigate(`/product/${productId}`);
        setSearchOpen(false);
        setSearchQuery('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setUser(null);
        setProfileDropdownOpen(false);
        // Dispatch event for other components
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return parts[0][0] + parts[1][0];
        }
        return name[0].toUpperCase();
    };

    const navbarClass = `navbar ${isHome && !scrolled ? 'transparent' : 'solid'} ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'mobile-menu-open' : ''}`;

    return (
        <nav className={navbarClass}>
            <div className="container navbar-content">
                <div className="navbar-left">
                    <button className="mobile-menu-toggle mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X className="icon" size={24} /> : <Menu className="icon" size={24} />}
                    </button>
                    <div className={`nav-links ${menuOpen ? 'mobile-open' : 'desktop-only'}`}>
                        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
                        <Link to="/about" onClick={() => setMenuOpen(false)}>Our Story</Link>
                    </div>
                </div>

                <div className="navbar-center">
                    <Link to="/" className="logo">
                        <img src={zanizaLogo} alt="Zaniza" className="navbar-logo-img" />
                    </Link>
                </div>

                <div className="navbar-right">
                    <div className="search-container" ref={searchRef}>
                        {searchOpen ? (
                            <div className="search-bar-open">
                                <form onSubmit={handleSearchSubmit} className="search-form">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                    <button type="submit" className="search-submit-btn">
                                        <Search size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSearchClick}
                                        className="search-close-btn"
                                    >
                                        <X size={18} />
                                    </button>
                                </form>
                                {searchResults.length > 0 && (
                                    <div className="search-results">
                                        {searchResults.map(product => (
                                            <div
                                                key={product._id}
                                                className="search-result-item"
                                                onClick={() => handleResultClick(product._id)}
                                            >
                                                <img src={product.image} alt={product.name} />
                                                <div className="search-result-info">
                                                    <h4>{product.name}</h4>
                                                    <p>৳{product.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {searchQuery && searchResults.length === 0 && (
                                    <div className="search-results">
                                        <div className="search-no-results">No products found</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Search
                                className="icon"
                                size={24}
                                onClick={handleSearchClick}
                            />
                        )}
                    </div>
                    <div className="cart-icon">
                        <Link to="/cart">
                            <ShoppingBag className="icon" size={24} />
                            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                        </Link>
                    </div>
                    {user ? (
                        <div className="user-profile-menu" ref={profileRef}>
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="user-avatar"
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                />
                            ) : (
                                <div
                                    className="user-initials"
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                >
                                    {getInitials(user.name)}
                                </div>
                            )}
                            {profileDropdownOpen && (
                                <div className="profile-dropdown">
                                    <div className="profile-dropdown-header">
                                        <p>Signed in as</p>
                                        <h4>{user.name}</h4>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="profile-dropdown-item"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="profile-dropdown-item"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                    <div
                                        className="profile-dropdown-item logout"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="icon" style={{ fontSize: '0.9rem' }}>Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings } from 'lucide-react';
import { productAPI } from '../utils/api';
import ProductCarousel from '../components/ProductCarousel';
import zanizaLogo from '../assets/zaniza-logo.png';
import Loading from '../components/Loading';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [scrollY, setScrollY] = useState(0);

    const [loading, setLoading] = useState(true);

    // Track scroll for 3D effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check if user is admin
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                setUserRole(userData.role);
            } catch (err) {
                console.error('Error parsing user data:', err);
            }
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        productAPI.getAll()
            .then(data => {
                // Sort by createdAt descending (newest first)
                const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setFeaturedProducts(sorted.slice(0, 10)); // Top 10 for carousel
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background-layer"></div>
                <div className="container hero-container">
                    <div className="hero-text-content">
                        <div className="hero-logo-wrap">
                            <img src={zanizaLogo} alt="Zaniza" className="hero-logo-img" />
                        </div>
                        <h1 className="hero-title">Discover Authenticity</h1>
                        <p className="hero-subtitle">Wear Your Desire Dress With Authenticity, Quality and Trust</p>
                        <div className="hero-buttons">
                            <Link to="/shop" className="btn btn-primary">
                                Shop Collection
                            </Link>
                            {userRole === 'admin' && (
                                <Link to="/admin/orders" className="btn btn-admin">
                                    <Settings size={20} />
                                    Admin Panel
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="hero-featured-showcase">
                        {featuredProducts.length > 0 && (
                            <div className="hero-product-card">
                                <span className="trending-badge">New Arrival</span>
                                <img src={featuredProducts[0].image} alt={featuredProducts[0].name} className="hero-product-img" />
                                <div className="hero-product-info">
                                    <h3>{featuredProducts[0].name}</h3>
                                    <p className="hero-product-price">৳{featuredProducts[0].price}</p>
                                    <Link to={`/product/${featuredProducts[0]._id}`} className="hero-view-btn">View Details</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* New Arrivals Carousel */}
            <ProductCarousel products={featuredProducts} title="New Arrivals" />

            <div className="text-center mt-5 mb-5">
                <Link to="/shop" className="btn btn-outline">View All Products</Link>
            </div>

            {/* About Teaser */}
            <section className="about-teaser section-padding mb-5">
                <div className="container">
                    <div className="about-text text-center">
                        <h2>Zaniza Chittagong</h2>
                        <p>
                            We bring you the finest collection of traditional and contemporary ethnic wear.
                            From intricate Kameez sets to elegant Sarees, our products are curated for the modern woman
                            who values tradition and quality.
                        </p>
                        <Link to="/about" className="btn btn-outline mt-4">Our Story</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

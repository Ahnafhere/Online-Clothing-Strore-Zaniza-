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
                {/* Cinematic Background Layer */}
                <div className="hero-background-layer"></div>

                {/* Floating Particles - Removed to stop blinking effect */}
                {/* <div className="particles-container">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`
                            }}
                        />
                    ))}
                </div> */}

                <div className="hero-content text-center">
                    <div className="hero-logo-wrap">
                        <img src={zanizaLogo} alt="Zaniza" className="hero-logo-img" />
                    </div>
                    <h1 className="hero-title">Wear Your Desire</h1>
                    <p className="hero-subtitle">Zaniza — Quality and Trust.</p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link to="/shop" className="btn btn-primary mt-4">
                            Shop Collection
                        </Link>
                        {userRole === 'admin' && (
                            <Link to="/admin/orders" className="btn btn-admin mt-4">
                                <Settings size={20} />
                                Admin Panel
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* New Arrivals Carousel */}
            <ProductCarousel products={featuredProducts} title="New Arrivals" />

            <div className="text-center mb-5">
                <Link to="/shop" className="btn btn-outline">View All Products</Link>
            </div>

            {/* About Teaser */}
            <section className="about-teaser section-padding">
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

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, ArrowRight } from 'lucide-react';
import { productAPI } from '../utils/api';
import ProductCarousel from '../components/ProductCarousel';
import zanizaLogo from '../assets/zaniza-logo.png';
import Loading from '../components/Loading';
import './Home.css';

const Home = () => {
    const [newArrivals, setNewArrivals] = useState([]);
    const [carouselProducts, setCarouselProducts] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                // Sort by createdAt descending — newest first
                const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setNewArrivals(sorted.slice(0, 8));      // Up to 8 products in the sidebar
                setCarouselProducts(sorted.slice(0, 10)); // Top 10 for carousel below
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="home">

            {/* ── Full-Dark Hero with New Arrivals Sidebar ── */}
            <section className="hero-dark">
                {/* LEFT — Branding panel */}
                <div className="hero-brand-panel">
                    <img src={zanizaLogo} alt="Zaniza" className="hero-brand-logo" />
                    <div className="hero-brand-badge">New Collection 2026</div>
                    <h1 className="hero-brand-title">Discover Authenticity</h1>
                    <p className="hero-brand-sub">
                        Wear Your Desire Dress With<br />Authenticity, Quality and Trust
                    </p>
                    <div className="hero-brand-actions">
                        <Link to="/shop" className="hero-shop-btn">
                            Shop Collection <ArrowRight size={18} />
                        </Link>
                        {userRole === 'admin' && (
                            <Link to="/admin/orders" className="btn btn-admin" style={{ marginTop: 0 }}>
                                <Settings size={18} /> Admin
                            </Link>
                        )}
                    </div>
                </div>

                {/* RIGHT — Scrollable New Arrivals sidebar */}
                <div className="hero-arrivals-panel">
                    <div className="arrivals-panel-header">
                        <span className="arrivals-label">NEW ARRIVALS</span>
                        <Link to="/shop" className="arrivals-view-all">View All →</Link>
                    </div>
                    <div className="arrivals-scroll">
                        {newArrivals.map((product, index) => (
                            <div
                                key={product._id}
                                className="arrival-item"
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <div className="arrival-item-img-wrap">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="arrival-item-img"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/100x120?text=No+Image'}
                                    />
                                    {index === 0 && <span className="arrival-new-dot">NEW</span>}
                                </div>
                                <div className="arrival-item-info">
                                    <p className="arrival-item-category">{product.category}</p>
                                    <h4 className="arrival-item-name">{product.name}</h4>
                                    <p className="arrival-item-price">৳{product.price}</p>
                                </div>
                                <ArrowRight className="arrival-arrow" size={16} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals Carousel */}
            <ProductCarousel products={carouselProducts} title="New Arrivals" />

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


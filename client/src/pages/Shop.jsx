import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productAPI } from '../utils/api';
import Loading from '../components/Loading';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [error, setError] = useState(null);

    useEffect(() => {
        productAPI.getAll()
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                    setFilteredProducts(data);
                } else {
                    setProducts([]);
                    setFilteredProducts([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message || 'Failed to fetch products');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let filtered = [...products];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
        }

        // Apply category filter
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        setFilteredProducts(filtered);
    }, [searchQuery, selectedCategory, products]);

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
    };

    if (loading) return <Loading message="Exploring our collection..." />;

    const pageTitle = searchQuery
        ? `Zaniza | Search: ${searchQuery}`
        : `Zaniza | ${selectedCategory === 'All' ? 'Shop Collection' : selectedCategory}`;

    return (
        <div className="shop-page section-padding">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content="Explore our exclusive collection of traditional and ethnic wear. Find the perfect Kameez, Saree, or Fabric for any occasion." />
            </Helmet>
            <div className="container">
                <h1 className="page-title text-center">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Shop Collections'}
                </h1>

                {/* Category Filters */}
                <div className="filters text-center mb-4">
                    <button
                        className={`filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                        onClick={() => handleCategoryFilter('All')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${selectedCategory === 'Kameez' ? 'active' : ''}`}
                        onClick={() => handleCategoryFilter('Kameez')}
                    >
                        Kameez
                    </button>
                    <button
                        className={`filter-btn ${selectedCategory === 'Saree' ? 'active' : ''}`}
                        onClick={() => handleCategoryFilter('Saree')}
                    >
                        Sarees
                    </button>
                    <button
                        className={`filter-btn ${selectedCategory === 'Fabric' ? 'active' : ''}`}
                        onClick={() => handleCategoryFilter('Fabric')}
                    >
                        Fabrics
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger text-center mb-4" style={{ padding: '15px', backgroundColor: '#ffebeel', color: '#c00', borderRadius: '5px' }}>
                        <h3>Unable to load products</h3>
                        <p>{error}</p>
                        <p>Please try refreshing the page.</p>
                    </div>
                )}

                {!error && filteredProducts.length === 0 ? (
                    <div className="text-center">
                        <p>No products found. Try a different search or category.</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="product-card">
                                <div className="product-image">
                                    <Link to={`/product/${product._id}`}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
                                            }}
                                        />
                                        {product.countInStock === 0 && (
                                            <div className="stock-status-overlay">
                                                <span>Out of Stock</span>
                                            </div>
                                        )}
                                    </Link>
                                </div>
                                <div className="product-info">
                                    <Link to={`/product/${product._id}`}>
                                        <h3>{product.name}</h3>
                                    </Link>
                                    <p className="price">৳{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;

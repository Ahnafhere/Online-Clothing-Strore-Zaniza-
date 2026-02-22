import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productAPI } from '../utils/api';
import Loading from '../components/Loading';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        // Navigate to cart page immediately after adding
        navigate('/cart');
    };

    useEffect(() => {
        productAPI.getById(id)
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <Loading message="Fetching product details..." />;
    if (!product) return <div className="text-center section-padding">Product not found</div>;

    return (
        <div className="product-details-page section-padding">
            <Helmet>
                <title>Zaniza | {product.name}</title>
                <meta name="description" content={product.description || `Buy ${product.name} at Zaniza.`} />
            </Helmet>
            <div className="container">
                <div className="details-wrapper">
                    <div className="details-image">
                        <img
                            src={product.image}
                            alt={product.name}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/600x600?text=Product+Image';
                            }}
                        />
                    </div>
                    <div className="details-info">
                        <span className="category-tag">{product.category}</span>
                        <h1>{product.name}</h1>
                        <p className="details-price">৳{product.price}</p>
                        <div className="description">
                            <p>{product.description}</p>
                        </div>

                        {/* Added product meta and actions */}
                        <div className="product-meta">
                            <p>Category: <span>{product.category}</span></p>
                            <p>Status: <span className={(product.countInStock || 0) > 0 ? 'text-green-600' : 'text-red-600'}>
                                {(product.countInStock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                            </span></p>
                        </div>

                        <div className="product-actions">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={(product.countInStock || 0) === 0}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min((product.countInStock || 0), q + 1))} disabled={(product.countInStock || 0) === 0 || quantity >= (product.countInStock || 0)}>+</button>
                            </div>
                            <button
                                className="btn btn-primary add-to-cart-btn"
                                onClick={handleAddToCart}
                                disabled={(product.countInStock || 0) === 0}
                            >
                                <ShoppingBag size={20} /> {(product.countInStock || 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>

                        <div className="delivery-info mt-4">
                            <p><strong>Quality Guaranteed</strong></p>
                            <p>Delivery available all over Bangladesh.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

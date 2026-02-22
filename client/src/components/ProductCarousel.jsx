import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductCarousel.css';

const ProductCarousel = ({ products, title = "New Arrivals" }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const timeoutRef = useRef(null);
    const delay = 3500; // 3.5 seconds per slide

    // We want to show 3 or 4 items depending on screen size, 
    // but for the carousel logic we'll increment one by one.
    // However, to make it "appear one by one", we simply increment the offset (activeIndex).

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setActiveIndex((prevIndex) =>
                    prevIndex === products.length - 1 ? 0 : prevIndex + 1
                ),
            delay
        );

        return () => {
            resetTimeout();
        };
    }, [activeIndex, products.length]);

    if (!products || products.length === 0) return null;

    // Helper to calculate translation
    // We want to show roughly 3.5 items on desktop.
    // Let's say item width is 280px + gap.

    return (
        <section className="product-carousel-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{title}</h2>
                    <div className="carousel-controls">
                        <button
                            className="control-btn"
                            onClick={() => {
                                setActiveIndex(prev => prev === 0 ? products.length - 1 : prev - 1);
                                resetTimeout();
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className="control-btn"
                            onClick={() => {
                                setActiveIndex(prev => prev === products.length - 1 ? 0 : prev + 1);
                                resetTimeout();
                            }}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div className="carousel-viewport">
                    <div
                        className="carousel-track"
                        style={{ transform: `translate3d(${-activeIndex * 300}px, 0, 0)` }}
                    >
                        {products.map((product) => (
                            <div key={product._id} className="carousel-card">
                                <div className="carousel-image-wrapper">
                                    <Link to={`/product/${product._id}`}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/300x400?text=Product'}
                                        />
                                    </Link>
                                    {product.countInStock === 0 && (
                                        <span className="stock-badge">Out of Stock</span>
                                    )}
                                </div>
                                <div className="carousel-info">
                                    <Link to={`/product/${product._id}`}>
                                        <h3>{product.name}</h3>
                                    </Link>
                                    <p className="price">৳{product.price}</p>
                                </div>
                            </div>
                        ))}
                        {/* Duplicate first few items to create infinite illusion if needed, but for simple scroll we just stop or loop. 
                             For simplicity of this prompt, we just loop back to start. */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductCarousel;

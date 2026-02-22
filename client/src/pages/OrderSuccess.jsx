import { Link, useLocation } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();
    const orderId = location.state?.orderId || 'Unknown';
    const [showConfetti, setShowConfetti] = useState(false);
    const { clearCart } = useCart();

    // Simple confetti effect trigger (optional, or just stick to Clean UI)
    useEffect(() => {
        clearCart(); // Clear cart immediately when success page mounts
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="order-success-page">
            <div className="success-container"> {/* Wrapper for centering */}
                {/* Only basic confetti if we had the library, but let's do a clean UI focus first */}

                <div className="success-card">
                    <div className="icon-wrapper">
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: '#d4edda',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                        }}>
                            <Check size={40} color="#155724" strokeWidth={3} />
                        </div>
                    </div>

                    <h1 className="success-title">Order Placed!</h1>

                    <p className="success-message">
                        Thank you for your purchase. Your order has been securely processed and is on its way.
                    </p>

                    <div className="order-id-box">
                        <span className="order-id-label">Order ID</span>
                        <span className="order-id-value">#{orderId}</span>
                    </div>

                    <p className="email-hint">
                        ADMIN will contact you as soon as possible.
                    </p>

                    <Link to="/shop" className="continue-btn">
                        <ShoppingBag size={20} style={{ marginRight: '8px' }} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;

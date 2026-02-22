import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart } = useCart();

    if (cartCount === 0) {
        return (
            <div className="cart-page empty-state section-padding text-center">
                <h2>Your Bag is Empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/shop" className="btn btn-primary mt-4">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="cart-page section-padding">
            <div className="container">
                <h1 className="mb-4">Shopping Bag ({cartCount})</h1>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item._id} className="cart-item">
                                <div className="cart-item-image">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                                        }}
                                    />
                                </div>
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">৳{item.price}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>৳{cartTotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>৳{cartTotal}</span>
                        </div>
                        <Link to="/checkout" className="btn btn-primary w-full checkout-btn">
                            Proceed to Checkout <ArrowRight size={18} />
                        </Link>
                        <button className="btn btn-outline w-full mt-2" onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

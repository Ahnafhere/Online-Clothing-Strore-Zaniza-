import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../utils/api';
import { CreditCard, Truck, Banknote, Landmark } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();

    // Redirect if cart is empty, but only if not currently on this page (handled by useEffect to avoid render-time side effects)
    useEffect(() => {
        if (cart.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Bangladesh',
        phone: '',
        paymentMethod: 'Cash on Delivery',
        transactionId: '',
        bkashNumber: ''
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePaymentChange = (method) => {
        setFormData({
            ...formData,
            paymentMethod: method
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            orderItems: cart.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                product: item._id
            })),
            guestInfo: {
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone
            },
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                country: formData.country
            },
            paymentMethod: formData.paymentMethod,
            paymentDetails: {
                transactionId: formData.transactionId,
                phoneNumber: formData.bkashNumber
            },
            totalPrice: cartTotal
        };

        try {
            const createdOrder = await orderAPI.create(orderData);
            // Navigate to success page - it will handle clearing the cart
            navigate('/order-success', { state: { orderId: createdOrder._id }, replace: true });
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page section-padding">
            <div className="container">
                <h1 className="mb-4">Checkout</h1>

                <form onSubmit={handleSubmit} className="checkout-grid">
                    {/* Left Column: Forms */}
                    <div className="checkout-left">
                        {/* Contact Information */}
                        <div className="checkout-section checkout-form-section mb-4">
                            <h2>Contact Information</h2>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-control"
                                    required
                                    placeholder="Your full name"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    required
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    required
                                    placeholder="01XXXXXXXXX"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="checkout-section checkout-form-section mb-4">
                            <h2>Delivery Address</h2>
                            <div className="form-group">
                                <label>Full Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    required
                                    placeholder="House, Road, Area"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className="form-control"
                                        required
                                        value={formData.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        className="form-control"
                                        required
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="checkout-section checkout-form-section">
                            <h2>Payment Method</h2>
                            <div className="payment-methods">
                                {/* Cash on Delivery */}
                                <div
                                    className={`payment-method-card ${formData.paymentMethod === 'Cash on Delivery' ? 'active' : ''}`}
                                    onClick={() => handlePaymentChange('Cash on Delivery')}
                                >
                                    <div className="method-icon">
                                        <Truck size={20} color="#1a472a" />
                                    </div>
                                    <div className="method-info">
                                        <h4>Cash on Delivery</h4>
                                        <p>Pay with cash upon delivery</p>
                                    </div>
                                </div>

                                {/* Bkash */}
                                <div
                                    className={`payment-method-card ${formData.paymentMethod === 'Bkash' ? 'active' : ''}`}
                                    onClick={() => handlePaymentChange('Bkash')}
                                >
                                    <div className="method-icon" style={{ color: '#e2136e' }}>
                                        <Banknote size={20} />
                                    </div>
                                    <div className="method-info">
                                        <h4>Bkash Payment</h4>
                                        <p>Send money to merchant number</p>
                                    </div>
                                </div>

                                {/* Nagad */}
                                <div
                                    className={`payment-method-card ${formData.paymentMethod === 'Nagad' ? 'active' : ''}`}
                                    onClick={() => handlePaymentChange('Nagad')}
                                >
                                    <div className="method-icon" style={{ color: '#ec1c24' }}>
                                        <Landmark size={20} />
                                    </div>
                                    <div className="method-info">
                                        <h4>Nagad Payment</h4>
                                        <p>Send money to merchant number</p>
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Payment Inputs */}
                            {formData.paymentMethod === 'Bkash' && (
                                <div className="bkash-details">
                                    <p className="mb-2"><strong>Instructions:</strong> Please <strong>Send Money</strong> to <strong>01919983421</strong> (Personal).</p>
                                    <div className="form-group">
                                        <label>Your Bkash Number</label>
                                        <input
                                            type="tel"
                                            name="bkashNumber"
                                            className="form-control"
                                            required
                                            placeholder="01XXXXXXXXX"
                                            value={formData.bkashNumber}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Transaction ID (TrxID)</label>
                                        <input
                                            type="text"
                                            name="transactionId"
                                            className="form-control"
                                            required
                                            placeholder="8N7..."
                                            value={formData.transactionId}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.paymentMethod === 'Nagad' && (
                                <div className="nagad-details">
                                    <p className="mb-2"><strong>Instructions:</strong> Please <strong>Send Money</strong> to <strong>01755871455</strong> (Personal).</p>
                                    <div className="form-group">
                                        <label>Your Nagad Number</label>
                                        <input
                                            type="tel"
                                            name="bkashNumber" // Reusing same state for simplicity
                                            className="form-control"
                                            required
                                            placeholder="01XXXXXXXXX"
                                            value={formData.bkashNumber}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Transaction ID (TxnID)</label>
                                        <input
                                            type="text"
                                            name="transactionId"
                                            className="form-control"
                                            required
                                            placeholder="7X3..."
                                            value={formData.transactionId}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="checkout-right">
                        <div className="checkout-section checkout-summary-section">
                            <h2>Order Summary</h2>
                            <div className="summary-items">
                                {cart.map(item => (
                                    <div key={item._id} className="summary-item">
                                        <img src={item.image} alt={item.name} className="summary-image" />
                                        <div className="summary-info">
                                            <h4>{item.name}</h4>
                                            <p className="text-sm text-gray-500">{item.quantity} x ৳{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals">
                                <div className="total-row">
                                    <span>Subtotal</span>
                                    <span>৳{cartTotal}</span>
                                </div>
                                <div className="total-row">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="total-row final">
                                    <span>Total</span>
                                    <span>৳{cartTotal}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary place-order-btn"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;

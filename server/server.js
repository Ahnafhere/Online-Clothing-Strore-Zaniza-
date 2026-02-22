require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const { generateToken, authenticate, isAdmin } = require('./middleware/auth');
const passport = require('./config/passport');
const session = require('express-session');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Session needed for Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'authentic-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
// MongoDB Connection Strategy for Serverless
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authentic-shop';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable buffering to fail fast
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
            console.log('✅ MongoDB Connected Successfully');
            // Seed data only once connection is established
            // Non-blocking seed to prevent cold-start timeouts
            seedInitialData();
            seedAdminUser();
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

// Middleware to ensure database is connected before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        // Use 'message' so frontend api.js can display it
        res.status(500).json({
            message: `Database Error: ${error.message}`,
            details: error.message
        });
    }
});

// ==================== AUTH ROUTES ====================

// Google Auth Logic
app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=google_failed' }),
    (req, res) => {
        // Successful authentication
        const token = generateToken(req.user._id, req.user.role);
        const userImage = req.user.image || '';

        // Redirect to frontend with token
        // Use dynamic client URL based on environment
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const redirectUrl = `${clientUrl}/login?token=${token}&role=${req.user.role}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&image=${encodeURIComponent(userImage)}`;
        res.redirect(redirectUrl);
    }
);

// Seed initial products if database is empty
async function seedInitialData() {
    try {
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('📦 Seeding initial products...');
            const initialProducts = [
                {
                    name: "Emerald Green Kameez Set",
                    category: "Kameez",
                    price: 3500,
                    image: "https://images.unsplash.com/photo-1583391733958-37c265a6e279?auto=format&fit=crop&q=80&w=1000",
                    description: "Elegant emerald green kameez with intricate gold embroidery. Perfect for festive occasions.",
                    isFeatured: true
                },
                {
                    name: "Classic Red Banarasi Saree",
                    category: "Saree",
                    price: 12000,
                    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000",
                    description: "Traditional red Banarasi saree with wide golden borders. A timeless masterpiece.",
                    isFeatured: true
                },
                {
                    name: "Batik Print Silk Fabric",
                    category: "Fabric",
                    price: 1200,
                    image: "https://images.unsplash.com/photo-1596483738096-787be09c95d9?auto=format&fit=crop&q=80&w=1000",
                    description: "Premium silk fabric with artistic batik prints. Suitable for custom tailoring.",
                    isFeatured: false
                },
                {
                    name: "Royal Blue Georgette Suit",
                    category: "Kameez",
                    price: 4200,
                    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=1000",
                    description: "Flowy georgette suit in royal blue, adorned with stone work.",
                    isFeatured: true
                },
                {
                    name: "Pink Cotton Salwar Kameez",
                    category: "Kameez",
                    price: 2500,
                    image: "https://images.unsplash.com/photo-1631233859262-0d625cf0264b?auto=format&fit=crop&q=80&w=800",
                    description: "Comfortable pink cotton salwar kameez for daily wear.",
                    isFeatured: false
                }
            ];
            await Product.insertMany(initialProducts);
            console.log('✅ Initial products seeded successfully!');
        } else {
            console.log(`📊 Found ${productCount} products in database`);
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

// Seed admin user if doesn't exist
// Seed admin user (and fix permissions)
async function seedAdminUser() {
    try {
        const adminEmail = 'zanizaBD@gmail.com'; // User's actual email

        // Check if this specific user exists
        const user = await User.findOne({ email: adminEmail });

        if (user) {
            if (user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
                console.log(`✅ Promoted ${adminEmail} to ADMIN`);
            } else {
                console.log(`✅ ${adminEmail} is already ADMIN`);
            }
        } else {
            // If user deletes account, recreate it
            console.log('👤 Creating default admin user...');
            const admin = new User({
                name: 'Zaniza Admin',
                email: adminEmail,
                password: 'Tasneem-11', // Will be hashed automatically
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Admin user created!');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
}

// Routes

// ==================== AUTHENTICATION ROUTES ====================

// Register new user (Customer)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create new user (default role: customer)
        const user = new User({
            name,
            email,
            password,
            phone,
            role: 'customer'
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login (Both Customer and Admin)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get current user
app.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== ORDER ROUTES ====================

// POST create new order (guest or authenticated)
app.post('/api/orders', async (req, res) => {
    try {
        const {
            orderItems,
            guestInfo,
            shippingAddress,
            paymentMethod,
            paymentDetails,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Check if user is authenticated (optional)
        let userId = null;
        let userEmail = null;
        let userName = null;
        let userPhone = null;

        const token = req.headers.authorization?.split(' ')[1];
        console.log('🔍 Order Debug: Authorization Header present:', !!token);
        console.log('🔍 Order Debug: guestInfo present:', !!guestInfo);

        if (token) {
            try {
                const jwt = require('jsonwebtoken');
                const { JWT_SECRET } = require('./config/keys');
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.userId;
                console.log('🔍 Order Debug: Token valid, userId:', userId);

                // Fetch user for email
                const user = await User.findById(userId);
                if (user) {
                    userEmail = user.email;
                    userName = user.name;
                    userPhone = user.phone;
                    console.log('🔍 Order Debug: Found Auth User Email:', userEmail);
                }
            } catch (err) {
                console.warn('🔍 Order Debug: Token verification failed:', err.message);
                userId = null;
            }
        }

        // IMPORTANT FALLBACK: If still no email (even if token existed), use guestInfo
        if (!userEmail && guestInfo) {
            userEmail = guestInfo.email;
            userName = guestInfo.name;
            userPhone = guestInfo.phone;
            console.log('🔍 Order Debug: Using Guest Info Email:', userEmail);
        }

        if (!userEmail) {
            console.warn('⚠️ Order Debug: NO EMAIL FOUND for order. Email will not be sent.');
        }

        const order = new Order({
            user: userId, // Will be null for guest orders
            guestInfo: guestInfo, // Always save contact info from checkout form
            orderItems,
            shippingAddress,
            paymentMethod,
            paymentDetails,
            totalPrice
        });

        const createdOrder = await order.save();
        const adminEmail = 'zanizaBD@gmail.com';

        // Send confirmation email (Must await for Vercel/Serverless to ensure it sends)
        if (userEmail) {
            try {
                const sendEmail = require('./utils/sendEmail');
                const orderId = createdOrder._id.toString().slice(-6).toUpperCase();

                // Construct Order Items HTML
                const itemsHtml = orderItems.map(item => `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">৳${item.price}</td>
                    </tr>
                `).join('');

                const emailSubjectCustomer = `Order Confirmation - Order #${orderId}`;
                const emailMessageCustomer = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                        <h2 style="color: #333;">Thank you for your order, ${userName || 'Customer'}!</h2>
                        <p>We have received your order and it is currently being processed.</p>
                        
                        <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px;">Order Summary (ID: #${orderId})</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #f8f8f8;">
                                    <th style="padding: 10px; text-align: left;">Item</th>
                                    <th style="padding: 10px; text-align: center;">Qty</th>
                                    <th style="padding: 10px; text-align: right;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                                    <td style="padding: 10px; text-align: right; font-weight: bold;">৳${totalPrice}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <h3>Shipping Details</h3>
                        <p>
                            ${shippingAddress.address}<br>
                            ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
                            ${shippingAddress.country}
                        </p>

                        <h3>Payment Method</h3>
                        <p>${paymentMethod}</p>

                        <p style="margin-top: 20px; color: #666;">We will notify you once your order has been shipped. Thank you for shopping with us!</p>
                        <br>
                        <p>Regards,<br><strong>Authentic | Chittagong Team</strong></p>
                    </div>
                `;

                // 1. Send to Customer
                console.log(`📦 Sending confirmation to customer: ${userEmail}...`);
                await sendEmail({
                    email: userEmail,
                    subject: emailSubjectCustomer,
                    message: emailMessageCustomer
                });

                // 2. Send to Admin
                const emailSubjectAdmin = `New Order Alert - Order #${orderId}`;
                const emailMessageAdmin = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                        <h2 style="color: #d9534f;">New Order Received!</h2>
                        <p>A new order has been placed on Authentic Shop.</p>
                        
                        <h3>Customer Info</h3>
                        <p>
                            <strong>Name:</strong> ${userName || 'N/A'}<br>
                            <strong>Email:</strong> ${userEmail}<br>
                            <strong>Phone:</strong> ${userPhone || 'N/A'}
                        </p>

                        <h3>Order Details (ID: #${orderId})</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #f8f8f8;">
                                    <th style="padding: 10px; text-align: left;">Item</th>
                                    <th style="padding: 10px; text-align: center;">Qty</th>
                                    <th style="padding: 10px; text-align: right;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                                    <td style="padding: 10px; text-align: right; font-weight: bold;">৳${totalPrice}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <h3>Address</h3>
                        <p>
                            ${shippingAddress.address}, ${shippingAddress.city}<br>
                            ${shippingAddress.postalCode}, ${shippingAddress.country}
                        </p>

                        <h3>Payment</h3>
                        <p><strong>Method:</strong> ${paymentMethod}</p>
                        ${paymentDetails && paymentDetails.transactionId ? `<p><strong>TrxID:</strong> ${paymentDetails.transactionId}</p>` : ''}
                        ${paymentDetails && paymentDetails.phoneNumber ? `<p><strong>Payment Number:</strong> ${paymentDetails.phoneNumber}</p>` : ''}

                        <p style="margin-top: 20px;"><a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/orders" style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Dashboard</a></p>
                    </div>
                `;

                console.log(`📦 Sending notification to admin: ${adminEmail}...`);
                await sendEmail({
                    email: adminEmail,
                    subject: emailSubjectAdmin,
                    message: emailMessageAdmin
                });

                console.log('✅ All emails sent successfully.');
            } catch (emailError) {
                console.error('❌ Email system error:', emailError);
            }
        }

        res.status(201).json(createdOrder);


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET logged in user's orders
app.get('/api/orders/myorders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET all orders (Admin only)
app.get('/api/admin/orders', authenticate, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email phone');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET order by ID
app.get('/api/orders/:id', authenticate, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email phone');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Ensure only admin or order owner can view
        if (req.userRole !== 'admin' && order.user._id.toString() !== req.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET pending orders count (Admin only)
app.get('/api/admin/orders/pending/count', authenticate, isAdmin, async (req, res) => {
    try {
        const count = await Order.countDocuments({ status: 'pending' });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update order status (Admin only)
app.put('/api/admin/orders/:id/status', authenticate, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;

        // Update delivery status and timestamp
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        } else {
            order.isDelivered = false;
            order.deliveredAt = null;
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== ADMIN ROUTES ====================

// GET Dashboard Stats
app.get('/api/admin/stats', authenticate, isAdmin, async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const customerCount = await User.countDocuments({ role: 'customer' });

        res.json({
            products: productCount,
            orders: orderCount,
            customers: customerCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== PRODUCT ROUTES ====================

// GET all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new product (Admin only)
app.post('/api/products', authenticate, isAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update product (Admin only)
app.put('/api/products/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE product (Admin only)
app.delete('/api/products/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// SEED Route (Reset data - for testing)
app.post('/api/seed', async (req, res) => {
    try {
        await Product.deleteMany({});
        await User.deleteMany({}); // Clear users too to ensure clean slate
        await seedInitialData();
        await seedAdminUser();
        res.json({ message: 'Database seeded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;

// Only listen if not running in Vercel (Vercel exports the app)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

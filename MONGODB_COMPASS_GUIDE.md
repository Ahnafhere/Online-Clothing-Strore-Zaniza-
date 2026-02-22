# How to See Your Database in MongoDB Compass

## 📍 Where to Look:

### Step 1: Find Your Database
In MongoDB Compass, look at the **left sidebar** under `localhost:27017`:

You should see these databases:
- ✅ **admin** (system database)
- ✅ **config** (system database) ← You're here now
- ✅ **local** (system database)
- ✅ **authentic-shop** ← **THIS IS YOUR DATABASE!** 🎯

### Step 2: Click on `authentic-shop`
1. In the left sidebar, find **`authentic-shop`**
2. Click on it to open it
3. You should see collections:
   - **`products`** - Your products
   - **`users`** - Your customers and admin accounts

### Step 3: View Your Data

#### To See Users (Login Info):
1. Click on **`authentic-shop`** database
2. Click on **`users`** collection
3. You'll see all registered users:
   - Admin user: `admin@authentic.com`
   - Customer users: All registered customers

#### To See Products:
1. Click on **`authentic-shop`** database
2. Click on **`products`** collection
3. You'll see all your products

---

## 🔍 If You Don't See `authentic-shop` Database:

### Option 1: Refresh MongoDB Compass
1. Click the **Refresh** button (circular arrow icon)
2. Or press `F5`
3. The database should appear

### Option 2: Database Not Created Yet
The database is created when:
- Server connects to MongoDB
- First data is saved (product or user)

**To create it:**
1. Make sure your server is running
2. Try registering a new user or adding a product
3. Refresh MongoDB Compass

---

## 📊 What You Should See:

### In `authentic-shop` → `users` collection:
```json
{
  "_id": "...",
  "name": "Admin",
  "email": "admin@authentic.com",
  "role": "admin",
  "password": "$2a$10$..." (hashed)
}
```

### In `authentic-shop` → `products` collection:
```json
{
  "_id": "...",
  "name": "Emerald Green Kameez Set",
  "category": "Kameez",
  "price": 3500,
  ...
}
```

---

## ✅ Quick Check:

1. **Refresh MongoDB Compass** (F5 or click refresh button)
2. Look for **`authentic-shop`** in the left sidebar
3. Click on it
4. You should see **`users`** and **`products`** collections
5. Click on **`users`** to see all login accounts

---

**You're currently looking at the `config` database (system database). Switch to `authentic-shop` to see your app data!**


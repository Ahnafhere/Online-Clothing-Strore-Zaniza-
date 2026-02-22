# Fix for 404 Error - Server Restart Required

## 🔴 Problem:
You're getting "API Error: 404 Not Found" because your server is running an **old version** without the authentication routes.

## ✅ Solution:

### Step 1: Stop the Current Server
1. Go to the terminal where your server is running
2. Press `Ctrl + C` to stop it

### Step 2: Restart the Server
```bash
cd server
npm start
```

### Step 3: Verify Server Started Correctly
You should see these messages:
- ✅ MongoDB Connected Successfully
- 👤 Creating default admin user...
- ✅ Admin user created!
- 🚀 Server running on port 5000

### Step 4: Test Again
1. Go back to your browser
2. Try registering again
3. It should work now!

---

## 🔍 If Still Not Working:

### Check 1: Verify Server is Running
Open a new terminal and run:
```bash
curl http://localhost:5000/api/products
```
Should return product data.

### Check 2: Verify Auth Route Exists
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

### Check 3: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try registering again
4. Check what URL is being called
5. Check the error response

---

## 💡 Common Issues:

1. **Server not restarted** - Most common issue
2. **Port conflict** - Another app using port 5000
3. **MongoDB not running** - Server can't connect to database
4. **CORS error** - Check server CORS settings

---

**After restarting, try again!**


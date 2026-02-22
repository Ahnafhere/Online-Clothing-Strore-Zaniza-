# How to Restart Your Server - Step by Step

## 🔴 Problem:
Your server is running but it has **OLD CODE** without the authentication endpoints.

## ✅ Solution: Restart the Server

### Method 1: Manual Restart (Recommended)

1. **Find the Terminal Window**
   - Look for the terminal/command prompt where your server is running
   - You should see messages like "Server running on port 5000"

2. **Stop the Server**
   - Click on that terminal window
   - Press `Ctrl + C` (hold Ctrl, press C)
   - The server will stop

3. **Restart the Server**
   ```bash
   cd server
   npm start
   ```

4. **Verify It Started Correctly**
   You should see these messages:
   ```
   ✅ MongoDB Connected Successfully
   👤 Creating default admin user...
   ✅ Admin user created!
   🚀 Server running on port 5000
   ```

5. **Test Again**
   - Go back to your browser
   - Try registering/login again
   - It should work now!

---

### Method 2: Using Task Manager (If Ctrl+C doesn't work)

1. **Open Task Manager**
   - Press `Ctrl + Shift + Esc`
   - Or right-click taskbar → Task Manager

2. **Find Node.js Process**
   - Look for "Node.js" or "node.exe"
   - Find the one using port 5000

3. **End the Process**
   - Right-click → End Task

4. **Restart Server**
   ```bash
   cd server
   npm start
   ```

---

### Method 3: Close All Node Processes (Last Resort)

**⚠️ Warning: This will close ALL Node.js processes**

```powershell
# Stop all Node processes
Get-Process -Name "node" | Stop-Process -Force

# Then restart your server
cd server
npm start
```

---

## 🔍 How to Know Server Restarted Correctly:

After restarting, you should see:
- ✅ MongoDB Connected Successfully
- 👤 Creating default admin user... (or ✅ Admin user already exists)
- 🚀 Server running on port 5000

**If you see errors**, check:
1. MongoDB is running (services.msc → MongoDB Server)
2. Port 5000 is not used by another app
3. All dependencies installed (`npm install` in server folder)

---

## ✅ After Restart:

1. Try registering a new user
2. Check MongoDB Compass → `authentic-shop` → `users` collection
3. You should see the new user!

---

**The key is: The server MUST be restarted to load the new authentication code!**


# Gmail App Password Setup Guide

Since you have 2-Step Verification enabled, you **must** use an "App Password" instead of your regular Gmail password.

### Step 1: Generate the App Password
1.  In your Google Account (where you took the screenshot), click on the **"2-Step Verification"** row.
2.  Scroll to the very bottom of the next page.
3.  Look for **"App passwords"** and click the small arrow `>` next to it.
4.  If asked, sign in again.
5.  Type a name like **"Authentic Website"** and click **Create**.
6.  **COPY the 16-character code** (the yellow box). It looks like `abcd efgh ijkl mnop`.

### Step 2: Update Local Project
1. Open your `server/.env` file.
2. Update the `EMAIL_PASS` with that 16-character code (**remove all spaces**):
   ```env
   EMAIL_PASS=abcdefghijklmnop
   ```

### Step 3: Update Vercel (Crucial for the live site)
1. Go to your [Vercel Dashboard](https://vercel.com).
2. Open your "Authentic" project.
3. Go to **Settings** -> **Environment Variables**.
4. Find `EMAIL_PASS`, click the three dots `...`, and **Edit** it.
5. Paste the new code (without spaces).
6. **IMPORTANT**: Go to the **Deployments** tab and **Redeploy** the latest version so Vercel picks up the new password.

---

**Once you have that 16-character code, let me know and I can help you update the files if you're unsure!**

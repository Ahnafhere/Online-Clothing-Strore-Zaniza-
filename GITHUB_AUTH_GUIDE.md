# GitHub Authentication Guide (Personal Access Token)

GitHub has deprecated password-based authentication for the command line. You must use a **Personal Access Token (PAT)** instead.

## 1. Generate your Token
1. Go to GitHub **Settings** (click your profile picture in the top right corner).
2. Scroll down on the left sidebar and click **<> Developer settings**.
3. Click **Personal access tokens** -> **Tokens (classic)**.
4. Click **Generate new token** -> **Generate new token (classic)**.
5. **Note**: Give it a name (e.g., "Zaniza Dev").
6. **Expiration**: Choose 30 days (or whatever you prefer).
7. **Select scopes**: Check the box for **repo** (this is all you need for pushing code).
8. Scroll to the bottom and click **Generate token**.

> [!IMPORTANT]
> **COPY THE TOKEN IMMEDIATELY.** You will not be able to see it again. Treat it like a password.

## 2. Use the Token in Terminal
When you run `git push` and it asks for your password:
1. **Username**: `Ahnafhere`
2. **Password**: Paste your **Personal Access Token** here (it won't show characters as you paste, just hit Enter).

## 3. If you want to save the token (so you don't have to paste every time)
Run this command once:
```bash
git config --global credential.helper store
```
Now, the next time you push and enter the token, it will be saved on your computer.

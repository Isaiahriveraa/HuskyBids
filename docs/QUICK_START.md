# 🚀 Quick Start - MongoDB & Clerk Setup

## Step 1: Install Dependencies (2 minutes)

```bash
npm install mongoose
```

## Step 2: Create MongoDB Atlas Account (5 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free tier)
3. Create cluster (M0 FREE)
4. Create database user
5. Whitelist IP: 0.0.0.0/0 (for development)
6. Get connection string

## Step 3: Create Clerk Account (5 minutes)

1. Go to: https://clerk.com/
2. Sign up
3. Create application: "HuskyBids"
4. Enable: Email, Google, GitHub
5. Copy API keys

## Step 4: Update Environment Variables (2 minutes)

Create/update `.env.local`:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/huskybids?retryWrites=true&w=majority

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Step 5: Test Everything (2 minutes)

```bash
# Restart dev server
npm run dev

# Visit in browser:
http://localhost:3002/api/test/db
```

You should see:

```json
{
  "success": true,
  "message": "✅ MongoDB connection successful!",
  "collections": {
    "users": 0,
    "games": 0,
    "bets": 0
  }
}
```

## ✅ Success Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster is running
- [ ] Database user created
- [ ] Connection string copied
- [ ] Clerk account created
- [ ] Clerk application created
- [ ] API keys copied
- [ ] `.env.local` updated
- [ ] `npm install mongoose` completed
- [ ] Dev server restarted
- [ ] `/api/test/db` returns success

## 🆘 Common Issues

**MongoDB Connection Failed:**

- Check connection string format
- Verify password (no special characters)
- Whitelist IP address: 0.0.0.0/0

**Clerk Not Working:**

- Make sure you're using YOUR keys
- Restart dev server after .env changes
- Check Clerk dashboard for status

## 📁 Files Created

✅ `/lib/mongodb.js` - Database connection  
✅ `/models/User.js` - User schema  
✅ `/models/Game.js` - Game schema  
✅ `/models/Bet.js` - Bet schema  
✅ `/pages/api/test/db.js` - Test endpoint

## 🎯 Next Steps

After successful setup:

1. **Test database**: Visit `/api/test/db`
2. **Create first user**: Sign up via Clerk
3. **Add sample game**: Use API or dashboard
4. **Place test bet**: Build betting UI

## 📚 Full Documentation

See `SETUP_GUIDE.md` for detailed instructions.

---

**Total Setup Time**: ~15 minutes  
**Difficulty**: Easy  
**Cost**: $0 (100% Free)

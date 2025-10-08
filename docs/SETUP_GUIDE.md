# 🚀 HuskyBids Setup Guide - Getting Started

This guide will walk you through setting up MongoDB and your own Clerk account for the HuskyBids project.

---

## Part 1: MongoDB Atlas Setup (15 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email (or use Google/GitHub login)
3. Choose the **FREE** tier
4. Fill out the survey (optional, can skip)

### Step 2: Create Your First Cluster

1. Click **"Build a Database"**
2. Choose **M0 FREE** tier (should be pre-selected)
3. Select a cloud provider: **AWS** (recommended)
4. Choose region closest to you (e.g., **us-west-2** for Seattle)
5. Name your cluster: `huskybids-cluster` (or any name)
6. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Create Database User

1. Click **"Database Access"** in left sidebar (under Security)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `huskybids-admin` (or your choice)
5. Click **"Autogenerate Secure Password"** - **COPY THIS PASSWORD!**
6. Built-in Role: Choose **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist IP Address

1. Click **"Network Access"** in left sidebar (under Security)
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, you'll restrict this
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string - looks like:
   ```
   mongodb+srv://<username>:<password>@huskybids-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` with your database username
7. Replace `<password>` with the password you copied earlier

### Step 6: Add to Environment Variables

1. Open your project folder
2. Create/edit `.env.local` file in the root:
   ```bash
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://huskybids-admin:YOUR_PASSWORD@huskybids-cluster.xxxxx.mongodb.net/huskybids?retryWrites=true&w=majority
   ```
3. Replace with your actual connection string
4. Add database name after `.net/`: `huskybids`

---

## Part 2: Clerk Account Setup (10 minutes)

### Step 1: Create Your Clerk Account

1. Go to https://clerk.com/
2. Click **"Start Building for Free"**
3. Sign up with your email or GitHub
4. Verify your email

### Step 2: Create Application

1. Click **"Create Application"**
2. Application name: **HuskyBids**
3. Choose sign-in methods:
   - ✅ **Email address** (required)
   - ✅ **Google** (optional, recommended)
   - ✅ **GitHub** (optional, good for dev community)
4. Click **"Create Application"**

### Step 3: Get API Keys

1. You'll see your API keys on the screen
2. Copy both keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

### Step 4: Update Environment Variables

1. Open `.env.local` file
2. Remove old Clerk keys if they exist
3. Add your new keys:
   ```bash
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ```

### Step 5: Configure Clerk Settings

1. In Clerk dashboard, go to **"User & Authentication"** → **"Email, Phone, Username"**
2. Enable **Username** (required for HuskyBids)
3. Make username **required**
4. Go to **"Paths"**
5. Set paths:
   - Sign-in: `/login`
   - Sign-up: `/signup`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

---

## Part 3: Install Dependencies

```bash
# Navigate to your project
cd /Users/isaiahrivera/Documents/GitHub/huskybids

# Install MongoDB dependencies
npm install mongoose

# Install Clerk (if not already installed)
npm install @clerk/nextjs

# Optional: MongoDB utilities
npm install mongodb
```

---

## Part 4: Create Database Connection File

Create `lib/mongodb.js`:

```javascript
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
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
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
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

export default connectDB;
```

---

## Part 5: Create Your First Model

Create `models/User.js`:

```javascript
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    biscuits: {
      type: Number,
      default: 1000,
    },
    profileImage: String,
    totalBets: {
      type: Number,
      default: 0,
    },
    winningBets: {
      type: Number,
      default: 0,
    },
    losingBets: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model("User", UserSchema);
```

---

## Part 6: Test Your Setup

Create `pages/api/test/db.js`:

```javascript
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  try {
    await connectDB();

    // Count users in database
    const userCount = await User.countDocuments();

    res.status(200).json({
      success: true,
      message: "MongoDB connected!",
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
```

Test it by visiting: `http://localhost:3002/api/test/db`

---

## Part 7: Connect Clerk to MongoDB

Create `pages/api/webhooks/clerk.js`:

```javascript
import { Webhook } from "svix";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ error: "Missing webhook secret" });
  }

  const payload = await buffer(req);
  const payloadString = payload.toString();
  const headerPayload = req.headers;

  const svix_id = headerPayload["svix-id"];
  const svix_timestamp = headerPayload["svix-timestamp"];
  const svix_signature = headerPayload["svix-signature"];

  const wh = new Webhook(webhookSecret);
  let evt;

  try {
    evt = wh.verify(payloadString, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return res.status(400).json({ error: "Webhook verification failed" });
  }

  const { id, email_addresses, username, image_url } = evt.data;
  const eventType = evt.type;

  await connectDB();

  if (eventType === "user.created") {
    try {
      const newUser = await User.create({
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username || email_addresses[0].email_address.split("@")[0],
        profileImage: image_url,
        biscuits: 1000, // Starting biscuits
      });

      console.log("✅ User created in MongoDB:", newUser);
      return res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Failed to create user" });
    }
  }

  return res.status(200).json({ success: true });
}
```

---

## Part 8: Environment Variables Checklist

Your `.env.local` should have:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/huskybids?retryWrites=true&w=majority

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_... # Get this from Clerk dashboard → Webhooks

# Optional: For production
NODE_ENV=development
```

---

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoNetworkError"**

- Check if IP address is whitelisted (0.0.0.0/0 for dev)
- Verify connection string is correct
- Check if cluster is still provisioning (wait 5 minutes)

**Error: "Authentication failed"**

- Verify username/password in connection string
- Make sure password doesn't have special characters (use URL encoding)
- Check database user has correct permissions

### Clerk Issues

**Error: "Invalid publishable key"**

- Make sure you're using YOUR Clerk keys, not the old ones
- Check for typos in `.env.local`
- Restart dev server after changing env variables

**Users not appearing in MongoDB**

- Set up webhooks in Clerk dashboard
- Point webhook to: `https://your-domain.com/api/webhooks/clerk`
- For local testing, use ngrok or Clerk's testing mode

---

## Next Steps

1. ✅ Test MongoDB connection: Visit `/api/test/db`
2. ✅ Test Clerk auth: Try signing up at `/signup`
3. ✅ Verify user creation: Check MongoDB Atlas dashboard
4. 🚀 Start building the betting features!

---

## Useful Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Clerk Docs](https://clerk.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Need Help?**

- MongoDB Atlas Support: https://www.mongodb.com/support
- Clerk Support: https://clerk.com/support
- Stack Overflow: Tag questions with `mongodb`, `mongoose`, `clerk`, `next.js`

---

Good luck building HuskyBids! 🎉🏈

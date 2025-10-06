# 🧹 Cleanup Guide - Files to Delete

## ✅ Safe to Delete - Redundant/Unused Files

### 1. Old Layout System (Replaced by SimpleLayout)
These files are **no longer used** since we simplified to `SimpleLayout.jsx`:

```bash
# Delete these files:
src/app/AppLayout.jsx           # ❌ Replaced by SimpleLayout.jsx
src/app/ClientRoot.jsx          # ❌ Not used anymore
src/app/providers.jsx           # ❌ Not needed with SimpleLayout
src/context/BiscuitContext.jsx  # ❌ Context now in SimpleLayout
```

**Why?** We simplified your layout from 4 files → 1 file (SimpleLayout.jsx) which does everything.

---

### 2. Unused Components Folder
```bash
components/                     # ❌ Empty folder
```

**Why?** All your actual components are in `src/app/Components/`

---

### 3. Convex Database (Since using MongoDB now)
```bash
convex/                         # ❌ Not using Convex, using MongoDB
```

**Why?** You chose MongoDB instead of Convex, so the entire `convex/` folder is unused.

---

### 4. Testing/Experimental Pages
```bash
src/app/testSidebar/           # ❌ Test folder
src/app/testingHome/           # ❌ Test folder
src/app/simple-test/           # ❌ Test folder
src/app/login-testing/         # ❌ Duplicate of login
src/app/home/                  # ❌ Duplicate of page.jsx (home)
```

**Why?** These were for testing during development. Your actual pages are:
- `/login` - Real login page
- `/dashboard` - Main dashboard
- `/` (page.jsx) - Home page

---

### 5. Duplicate Config Files
```bash
tailwind.config.js             # ❌ Keep tailwind.config.mjs instead
```

**Why?** You have both `.js` and `.mjs` versions. Keep the `.mjs` one.

---

### 6. Random/Unused Files
```bash
src/app/ideas.txt              # ❌ Random notes file
src/app/data/                  # ❌ If it's mock data, can delete
.DS_Store files                # ❌ macOS system files
```

---

## 📊 Summary of Deletions

### Files That Are Redundant:
- **Old layout system**: 4 files (AppLayout, ClientRoot, providers, BiscuitContext)
- **Empty folders**: 1 (components/)
- **Convex database**: ~10+ files (entire convex/ folder)
- **Test pages**: 5 folders
- **Duplicate configs**: 1 file (tailwind.config.js)
- **Misc files**: 2-3 files

**Total: ~25-30 files/folders** can be safely deleted!

---

## 🚀 Automated Cleanup Script

Run this to clean everything at once:

```bash
cd /Users/isaiahrivera/Documents/GitHub/huskybids

# Delete old layout system
rm src/app/AppLayout.jsx
rm src/app/ClientRoot.jsx
rm src/app/providers.jsx
rm -rf src/context

# Delete Convex (using MongoDB now)
rm -rf convex

# Delete test/experimental pages
rm -rf src/app/testSidebar
rm -rf src/app/testingHome
rm -rf src/app/simple-test
rm -rf src/app/login-testing
rm -rf src/app/home

# Delete duplicate config
rm tailwind.config.js

# Delete empty/unused folders
rm -rf components

# Delete misc files
rm src/app/ideas.txt
rm -rf src/app/data

# Delete macOS system files
find . -name ".DS_Store" -delete

# Optional: Delete daily-tasks if it's just test HTML/CSS
# rm -rf src/app/daily-tasks

echo "✅ Cleanup complete!"
```

---

## ⚠️ Before You Delete - Verify These

Check if these are actually used:

### Check #1: Components
```bash
# See if MobileHeader, Header, Sidebar are imported anywhere
grep -r "MobileHeader" src/app/ --exclude-dir=Components
grep -r "Header" src/app/ --exclude-dir=Components
```

**Action**: 
- If `MobileHeader` and `Header` aren't used → can delete
- `Sidebar` might not be used since `SimpleLayout` has its own sidebar

### Check #2: Daily Tasks
```bash
ls -la src/app/daily-tasks/
```

**Action**: If it's just test HTML/CSS → can delete

### Check #3: Change Password/Username
```bash
ls -la src/app/change-password/
ls -la src/app/change-username/
```

**Action**: If these pages are empty or unfinished → can delete for now

---

## 🎯 What to Keep

### Essential Files (DO NOT DELETE):
```
✅ src/app/SimpleLayout.jsx       # Your main layout
✅ src/app/layout.jsx             # Root layout
✅ src/app/globals.css            # Global styles
✅ src/app/page.jsx               # Home page
✅ src/app/dashboard/             # Dashboard page
✅ src/app/betting-history/       # Betting history page
✅ src/app/leaderboard/           # Leaderboard page
✅ src/app/settings/              # Settings page
✅ src/app/new-bid/               # New bid page
✅ src/app/tasks/                 # Tasks page (if functional)
✅ src/app/login/                 # Login page
✅ lib/mongodb.js                 # Database connection
✅ models/                        # Database models
✅ pages/api/                     # API routes
✅ package.json                   # Dependencies
✅ .env.local                     # Your secrets
✅ tailwind.config.mjs            # Tailwind config
✅ next.config.mjs                # Next.js config
```

---

## 📝 Step-by-Step Manual Deletion

If you prefer to delete files manually (safer):

### Step 1: Delete Old Layout System
1. Delete `src/app/AppLayout.jsx`
2. Delete `src/app/ClientRoot.jsx`
3. Delete `src/app/providers.jsx`
4. Delete `src/context/` folder

### Step 2: Delete Convex
1. Delete `convex/` folder (entire thing)

### Step 3: Delete Test Pages
1. Delete `src/app/testSidebar/`
2. Delete `src/app/testingHome/`
3. Delete `src/app/simple-test/`
4. Delete `src/app/login-testing/`
5. Delete `src/app/home/`

### Step 4: Delete Duplicates
1. Delete `tailwind.config.js` (keep `.mjs`)
2. Delete `components/` empty folder

### Step 5: Clean Up
1. Delete `src/app/ideas.txt`
2. Delete `.DS_Store` files

---

## 🧪 Test After Cleanup

After deleting files:

```bash
# Restart dev server
npm run dev

# Test these pages:
http://localhost:3002/            # Home
http://localhost:3002/dashboard   # Dashboard
http://localhost:3002/leaderboard # Leaderboard
http://localhost:3002/betting-history # Betting history
```

Everything should still work! 🎉

---

## 📊 Before vs After

### Before Cleanup:
```
Total Files: ~150+
- Old layout system: 4 files
- Convex (unused): 10+ files
- Test pages: 5 folders
- Duplicate configs: 2 files
- Empty folders: 2
```

### After Cleanup:
```
Total Files: ~120
- Clean structure
- Only used files
- No redundancy
- Easier to navigate
```

**Result**: ~20-30% fewer files, much cleaner codebase! 🎯

---

## 💡 Benefits of Cleanup

1. ✅ **Faster builds** - Less files to process
2. ✅ **Less confusion** - No duplicate files
3. ✅ **Better organization** - Clear structure
4. ✅ **Easier maintenance** - Know what each file does
5. ✅ **Professional** - Clean codebase for portfolio

---

## ⚠️ Important Notes

1. **Backup first** (optional): `git commit -am "Before cleanup"`
2. **Delete gradually** - Start with obvious ones
3. **Test frequently** - Run `npm run dev` after each batch
4. **Use git** - You can always undo with `git checkout`

---

## 🎉 Ready to Clean?

Choose your approach:
- **Quick**: Run the automated script above
- **Safe**: Follow step-by-step manual deletion
- **Cautious**: Delete one file at a time and test

Good luck! Your codebase will be so much cleaner! 🧹✨

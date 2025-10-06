#!/bin/bash

# HuskyBids Safe Cleanup Script
# This script removes redundant and unused files

echo "🧹 HuskyBids Cleanup Script"
echo "=========================="
echo ""

# Ask for confirmation
read -p "⚠️  This will delete unused files. Continue? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Cleanup cancelled"
    exit 1
fi

echo ""
echo "📦 Creating backup commit first..."
git add -A
git commit -m "Backup before cleanup" 2>/dev/null || echo "No changes to commit"

echo ""
echo "🗑️  Deleting redundant files..."
echo ""

# 1. Delete old layout system (replaced by SimpleLayout)
echo "📁 Removing old layout system..."
rm -f src/app/AppLayout.jsx && echo "  ✅ Deleted AppLayout.jsx"
rm -f src/app/ClientRoot.jsx && echo "  ✅ Deleted ClientRoot.jsx"
rm -f src/app/providers.jsx && echo "  ✅ Deleted providers.jsx"
rm -rf src/context && echo "  ✅ Deleted src/context/ folder"

# 2. Delete Convex (using MongoDB now)
echo ""
echo "📁 Removing Convex (using MongoDB)..."
rm -rf convex && echo "  ✅ Deleted convex/ folder"

# 3. Delete test/experimental pages
echo ""
echo "📁 Removing test pages..."
rm -rf src/app/testSidebar && echo "  ✅ Deleted testSidebar/"
rm -rf src/app/testingHome && echo "  ✅ Deleted testingHome/"
rm -rf src/app/simple-test && echo "  ✅ Deleted simple-test/"
rm -rf src/app/login-testing && echo "  ✅ Deleted login-testing/"
rm -rf src/app/home && echo "  ✅ Deleted home/ (duplicate)"

# 4. Delete duplicate config
echo ""
echo "📁 Removing duplicate configs..."
rm -f tailwind.config.js && echo "  ✅ Deleted tailwind.config.js (keeping .mjs)"

# 5. Delete empty folders
echo ""
echo "📁 Removing empty folders..."
rm -rf components && echo "  ✅ Deleted empty components/ folder"

# 6. Delete misc files
echo ""
echo "📁 Removing misc files..."
rm -f src/app/ideas.txt && echo "  ✅ Deleted ideas.txt"
rm -rf src/app/data 2>/dev/null && echo "  ✅ Deleted data/ folder" || echo "  ⏭️  No data/ folder"

# 7. Delete macOS system files
echo ""
echo "📁 Removing .DS_Store files..."
find . -name ".DS_Store" -delete && echo "  ✅ Deleted all .DS_Store files"

# Optional: Check for unused components
echo ""
echo "🔍 Checking for potentially unused components..."
if [ -f "src/app/Components/MobileHeader.jsx" ]; then
    if ! grep -r "MobileHeader" src/app/*.jsx src/app/*/*.jsx 2>/dev/null | grep -v "Components/MobileHeader" > /dev/null; then
        echo "  ⚠️  MobileHeader.jsx might be unused (not deleting, verify manually)"
    fi
fi

if [ -f "src/app/Components/Header.jsx" ]; then
    if ! grep -r "import.*Header" src/app/*.jsx src/app/*/*.jsx 2>/dev/null | grep -v "Components/Header" | grep -v "MobileHeader" > /dev/null; then
        echo "  ⚠️  Header.jsx might be unused (not deleting, verify manually)"
    fi
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  • Removed old layout system (4 files)"
echo "  • Removed Convex database folder"
echo "  • Removed test pages (5 folders)"
echo "  • Removed duplicate configs"
echo "  • Removed empty folders"
echo "  • Cleaned up misc files"
echo ""
echo "🧪 Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Test your pages"
echo "  3. If everything works: git add -A && git commit -m 'Cleanup redundant files'"
echo "  4. If something broke: git reset --hard HEAD~1"
echo ""

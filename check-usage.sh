#!/bin/bash

# Component Usage Checker
# Usage: ./check-usage.sh <filename>

if [ -z "$1" ]; then
    echo "❌ Error: Please provide a filename"
    echo ""
    echo "Usage: ./check-usage.sh <filename>"
    echo ""
    echo "Examples:"
    echo "  ./check-usage.sh MobileHeader"
    echo "  ./check-usage.sh Sidebar"
    echo "  ./check-usage.sh BiscuitIcon"
    exit 1
fi

COMPONENT=$1

echo "🔍 Checking usage of: $COMPONENT"
echo "================================"
echo ""

# Search for imports
echo "📦 Searching for imports..."
IMPORT_COUNT=$(grep -r "import.*$COMPONENT" src/ --exclude-dir=Components 2>/dev/null | wc -l)

if [ $IMPORT_COUNT -eq 0 ]; then
    echo "❌ No imports found"
    echo ""
    echo "🗑️  This component is NOT being used anywhere!"
    echo "   Safe to delete."
else
    echo "✅ Found $IMPORT_COUNT import(s):"
    echo ""
    grep -r "import.*$COMPONENT" src/ --exclude-dir=Components 2>/dev/null | head -20
    echo ""
    echo "✅ This component IS being used!"
    echo "   DO NOT delete."
fi

echo ""
echo "================================"
echo ""

# Search for any usage (not just imports)
echo "🔎 Searching for any mentions..."
USAGE_COUNT=$(grep -r "$COMPONENT" src/ --exclude-dir=Components 2>/dev/null | wc -l)

if [ $USAGE_COUNT -gt 0 ]; then
    echo "Found $USAGE_COUNT mention(s) in code"
else
    echo "No mentions found outside Components folder"
fi

echo ""
echo "✅ Check complete!"
